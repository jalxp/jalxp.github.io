---
title: "WKWebView and JavaScript Communication"
description: "How to get your iOS app talking to web content. Some patterns I have found useful while working with WKWebView."
pubDate: 2025-12-30
categories: [ios]
tags: [swift, wkwebview, javascript, ios-development]
---

Working at GoodBarber, I've spent a lot of time building bridges between native iOS code and web content. It's one of those things that seems simple at first, but there are quite a few gotchas along the way. Here's what I've learned, including some nice improvements that came with iOS 14.

## Why this matters

If you're building an app that loads web content, you'll probably need to have your Swift code talk to JavaScript at some point. Maybe you need to pass user data to a web view, or maybe the web content needs to trigger native functionality. Either way, WKWebView gives you the tools to do this.

## The basic setup

Before anything else, you need a WKWebView. Here's a clean way to set it up:

```swift
import WebKit

class WebViewController: UIViewController {
    private let webView: WKWebView

    init() {
        let configuration = WKWebViewConfiguration()
        self.webView = WKWebView(frame: .zero, configuration: configuration)
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func loadView() {
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        guard let url = URL(string: "https://example.com") else {
            return
        }
        webView.load(URLRequest(url: url))
    }
}
```

Notice I'm making `webView` a non-optional stored property. This is cleaner than using `var webView: WKWebView!` everywhere - no forced unwrapping needed.

## Calling JavaScript from Swift

The simplest way to run JavaScript from your Swift code is `evaluateJavaScript`:

```swift
webView.evaluateJavaScript("document.title") { result, error in
    if let error = error {
        print("Error: \(error.localizedDescription)")
        return
    }

    if let title = result as? String {
        print("Page title: \(title)")
    }
}
```

This works fine for simple stuff. But when you need to pass data from Swift to JavaScript, things get a bit more interesting.

### Passing data safely

Let's say you want to update some user info in your web view:

```swift
func updateUserInfo(name: String, userId: Int) {
    let script = """
        window.updateUser({
            name: '\(name)',
            userId: \(userId)
        });
    """

    webView.evaluateJavaScript(script) { _, error in
        if let error = error {
            print("Failed to update user: \(error)")
        }
    }
}
```

This looks fine, but there's a problem. What if the user's name contains a quote character e.g. O'Brien? You'll break your JavaScript.

The better approach is to use JSON:

```swift
func sendDataToJavaScript<T: Encodable>(_ data: T, functionName: String) {
    do {
        let jsonData = try JSONEncoder().encode(data)
        guard let jsonString = String(data: jsonData, encoding: .utf8) else {
            print("Failed to convert JSON to string")
            return
        }

        let script = "\(functionName)(\(jsonString));"
        webView.evaluateJavaScript(script) { _, error in
            if let error = error {
                print("JavaScript error: \(error.localizedDescription)")
            }
        }
    } catch {
        print("Failed to encode data: \(error)")
    }
}
```

Now you can pass any Codable struct safely. The JSON encoder handles all the escaping for you.

## Getting messages from JavaScript

This is where it gets more interesting. To receive messages from JavaScript, you use `WKScriptMessageHandler`.

First, update your configuration:

```swift
init() {
    let configuration = WKWebViewConfiguration()
    configuration.userContentController.add(self, name: "nativeApp")

    self.webView = WKWebView(frame: .zero, configuration: configuration)
    super.init(nibName: nil, bundle: nil)
}
```

Then implement the handler protocol:

```swift
extension WebViewController: WKScriptMessageHandler {
    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        guard message.name == "nativeApp" else { return }
        print("Got message: \(message.body)")
    }
}
```

On the JavaScript side, you can now send messages like this:

```javascript
window.webkit.messageHandlers.nativeApp.postMessage("Hello!");

// Or send structured data
window.webkit.messageHandlers.nativeApp.postMessage({
    action: "navigate",
    screen: "profile"
});
```

### Handling different message types

I usually set up a simple routing system based on action types:

```swift
func userContentController(
    _ userContentController: WKUserContentController,
    didReceive message: WKScriptMessage
) {
    guard message.name == "nativeApp",
          let body = message.body as? [String: Any],
          let action = body["action"] as? String else {
        return
    }

    switch action {
    case "navigate":
        handleNavigation(body)
    case "share":
        handleShare(body)
    default:
        print("Unknown action: \(action)")
    }
}
```

It's basic, but it works well enough.

## A common pitfall: memory leaks

Here's something that bit me early on. When you add yourself as a message handler, WKWebView keeps a strong reference to you. This creates a retain cycle if you're not careful.

The fix is to use a weak wrapper:

```swift
class WeakScriptMessageHandler: NSObject, WKScriptMessageHandler {
    weak var delegate: WKScriptMessageHandler?

    init(_ delegate: WKScriptMessageHandler) {
        self.delegate = delegate
    }

    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        guard let delegate = delegate else {
            print("Warning: Message received but delegate is nil")
            return
        }
        delegate.userContentController(userContentController, didReceive: message)
    }
}
```

And clean up when you're done:

```swift
deinit {
    webView.configuration.userContentController.removeScriptMessageHandler(
        forName: "nativeApp"
    )
}
```

## Getting responses from native code (iOS 14+)

Here's something that changed in iOS 14 that makes life much easier. Before iOS 14, if JavaScript called native code and needed a response, you had to build your own callback system. Now there's `WKScriptMessageHandlerWithReply`.

This protocol lets JavaScript get a direct response as a Promise. It's cleaner than what I showed above.

```swift
init() {
    let configuration = WKWebViewConfiguration()

    // Note the contentWorld parameter and different method
    configuration.userContentController.addScriptMessageHandler(
        self,
        contentWorld: .page,
        name: "nativeAppWithReply"
    )

    self.webView = WKWebView(frame: .zero, configuration: configuration)
    super.init(nibName: nil, bundle: nil)
}

extension WebViewController: WKScriptMessageHandlerWithReply {
    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage,
        replyHandler: @escaping (Any?, String?) -> Void
    ) {
        guard message.name == "nativeAppWithReply" else {
            replyHandler(nil, "Unknown handler")
            return
        }

        // Do your work here
        let response = processMessage(message.body)

        // Send the response back to JavaScript
        // First parameter is the result, second is an error string (if any)
        replyHandler(response, nil)
    }

    private func processMessage(_ body: Any) -> String {
        // Your logic here
        return "Hello from native!"
    }
}
```

On the JavaScript side, it's really nice:

```javascript
// This returns a Promise!
try {
    const response = await window.webkit.messageHandlers.nativeAppWithReply.postMessage("Hello!");
    console.log(response); // "Hello from native!"
} catch (error) {
    console.error("Error:", error);
}

// Or with promise syntax
window.webkit.messageHandlers.nativeAppWithReply.postMessage("Hello!")
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error("Error:", error);
    });
```

This is much cleaner than rolling your own callback system. The Promise is built right into the API.

### Injecting JavaScript files

Another useful pattern is loading JavaScript from a file and injecting it. This keeps your Swift code cleaner:

```swift
private static func injectScript(named name: String) -> WKUserScript? {
    guard let scriptPath = Bundle.main.path(forResource: name, ofType: "js"),
          let scriptSource = try? String(contentsOfFile: scriptPath) else {
        print("Failed to load script: \(name)")
        return nil
    }

    return WKUserScript(
        source: scriptSource,
        injectionTime: .atDocumentEnd,
        forMainFrameOnly: false
    )
}

init() {
    let configuration = WKWebViewConfiguration()

    if let script = injectScript(named: "helpers") {
        configuration.userContentController.addUserScript(script)
    }

    self.webView = WKWebView(frame: .zero, configuration: configuration)
    super.init(nibName: nil, bundle: nil)
}
```

Now you can keep your JavaScript in a separate file where it's easier to work with. I have an [example project](https://github.com/jalxp/webkit-explore) that shows this pattern in action.

## Using structs for type safety

One thing that's helped a lot is using Codable structs instead of dictionaries everywhere:

```swift
struct WebMessage: Codable {
    let action: String
    let userId: Int?
    let content: String?
}

func userContentController(
    _ userContentController: WKUserContentController,
    didReceive message: WKScriptMessage
) {
    do {
        let bodyData = try JSONSerialization.data(withJSONObject: message.body)
        let webMessage = try JSONDecoder().decode(WebMessage.self, from: bodyData)
        handleMessage(webMessage)
    } catch {
        print("Failed to decode message: \(error)")
    }
}
```

It's more upfront work, but it catches errors at compile time instead of runtime.

## A practical example: feature toggles

Here's something I actually use - a feature toggle system that lets JavaScript check if native features are enabled:

```swift
private func setupFeatureToggle() {
    let script = WKUserScript(
        source: """
            window.NativeFeatures = {
                isEnabled: function(name) {
                    return window.webkit.messageHandlers.features.postMessage(name);
                }
            };
        """,
        injectionTime: .atDocumentStart,
        forMainFrameOnly: true
    )

    webView.configuration.userContentController.addUserScript(script)
    webView.configuration.userContentController.addScriptMessageHandler(
        self,
        contentWorld: .page,
        name: "features"
    )
}

extension WebViewController: WKScriptMessageHandlerWithReply {
    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage,
        replyHandler: @escaping (Any?, String?) -> Void
    ) {
        guard message.name == "features",
              let featureName = message.body as? String else {
            replyHandler(nil, "Invalid request")
            return
        }

        let isEnabled = checkFeature(featureName)
        replyHandler(isEnabled, nil)
    }

    private func checkFeature(_ name: String) -> Bool {
        // Your feature toggle logic here
        return UserDefaults.standard.bool(forKey: "feature_\(name)")
    }
}
```

Then in JavaScript:

```javascript
const canUseCamera = await window.NativeFeatures.isEnabled('camera');
if (canUseCamera) {
    // Show camera UI
}
```

Same memory rules apply here as with `WKScriptMessageHandler` - clean up in `deinit`:

```swift
deinit {
    webView.configuration.userContentController.removeScriptMessageHandler(
        forName: "features",
        contentWorld: .page
    )
}
```

## Things to remember

A few gotchas I've hit:

- `evaluateJavaScript` must be called from the main thread, and its callback is too. Update your UI there.
- Always handle errors. JavaScript can fail for many reasons.
- Clean up message handlers in deinit or you'll leak memory.
- Use JSON for anything non-trivial. String interpolation will bite you.
- Test with weird inputs. Special characters, long strings, Unicode, etc.
- If you need iOS 14+, use `WKScriptMessageHandlerWithReply`. It's much cleaner.

## Loading local HTML

One more thing - if you're loading local HTML files, do it properly:

```swift
override func viewDidLoad() {
    super.viewDidLoad()

    guard let htmlPath = Bundle.main.url(forResource: "page", withExtension: "html") else {
        print("Failed to find HTML file")
        return
    }

    webView.loadFileURL(htmlPath, allowingReadAccessTo: htmlPath)
}
```

The `allowingReadAccessTo` parameter is important - without it, the web view can't load resources referenced in your HTML.

## Wrapping up

WKWebView communication isn't complicated, but there are enough edge cases that it's worth getting the patterns right. Using proper error handling, avoiding forced unwrapping, and leveraging iOS 14+ features makes everything more reliable.

If you're doing similar work, I hope this helps. I've got a [small demo project](https://github.com/jalxp/webkit-explore) that shows these patterns if you want to see them in action. Feel free to reach out if you have questions or better approaches - I'm always learning.
