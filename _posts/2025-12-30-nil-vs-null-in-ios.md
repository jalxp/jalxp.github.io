---
layout: post
title: nil, Nil, NULL, and NSNull - A Brief History
description: >
  Why does iOS have so many ways to represent "nothing"? A look at where these came from and when to use each one.
sitemap: true
hide_last_modified: false
categories: [ios]
tags: [objective-c, swift, ios-development, history]
comments: true
---

When I first started iOS development, I was confused by all the different ways to represent "nothing". There's `nil`, `Nil`, `NULL`, and `NSNull`. Why so many? Turns out, there's actually a good reason for each one, and it tells an interesting story about Objective-C's history.

* toc
{:toc}

## The C foundation: NULL

To understand where all this comes from, you need to know that Objective-C is a strict superset of C. That means all valid C code is valid Objective-C code. In C, when you want a pointer to nothing, you use `NULL`:

```c
int *ptr = NULL;
char *string = NULL;
```

`NULL` is typically defined as `((void*)0)` - it's just a pointer to memory address zero. Simple and straightforward. This has been around since the beginning of C.

## Objective-C adds: nil

When Objective-C came along, it needed its own way to represent "no object". They could have just used `NULL`, but they wanted to make the distinction clear: `nil` is specifically for Objective-C objects.

```objective-c
NSString *name = nil;
UIView *view = nil;
```

Here's the interesting part: `nil` and `NULL` are actually the same thing under the hood. Both are defined as `((void*)0)`. The difference is semantic - it helps you (and the compiler) understand what kind of pointer you're dealing with.

```objective-c
// Both of these work, but nil is more idiomatic for objects
NSString *name1 = NULL;  // Works, but feels wrong
NSString *name2 = nil;   // Better - clearly an object
```

One nice thing about `nil` in Objective-C: you can send messages to it, and nothing happens. No crash, just returns zero/nil/false:

```objective-c
NSString *name = nil;
NSUInteger length = [name length];  // length = 0, no crash
```

This is different from C where dereferencing `NULL` crashes your program. Objective-C's runtime handles this for you.

## Then there's: Nil

Yeah, with a capital N. This one's for class pointers specifically:

```objective-c
Class someClass = Nil;
```

Again, it's the same as `NULL` and `nil` under the hood (all are `((void*)0)`), but the capitalization signals "this is a pointer to a Class object, not an instance."

In practice, I rarely use `Nil`. Most of the time you're working with instances, not class objects themselves. But it's there if you need it:

```objective-c
Class viewClass = [UIView class];
if (viewClass != Nil) {
    // Do something with the class
}
```

## The odd one out: NSNull

Now this one is actually different. `NSNull` is a real object. It's a singleton that represents null in situations where you can't use `nil`.

Why would you need this? Collections.

```objective-c
// This doesn't work - can't put nil in an array
NSArray *items = @[nil];  // Compile error or crash

// This works - NSNull is a real object
NSArray *items = @[[NSNull null]];
```

Foundation collections (NSArray, NSDictionary, NSSet) can only hold objects. When you have an array slot that should be empty, you can't use `nil` because that would just terminate the array. You need an actual object that means "this slot is intentionally empty."

```objective-c
// API returns array with some null values
NSArray *data = @[@"John", [NSNull null], @"Jane"];

for (id item in data) {
    if (item == [NSNull null]) {
        NSLog(@"Empty slot");
    } else {
        NSLog(@"Name: %@", item);
    }
}
```

This is especially common when dealing with JSON where `null` is a valid value:

```objective-c
// JSON: {"name": "John", "email": null}
NSDictionary *json = @{
    @"name": @"John",
    @"email": [NSNull null]
};
```

## The Swift perspective

Swift changed everything with optionals. Now you just have `nil`, and the type system handles the rest:

```swift
var name: String? = nil
var view: UIView? = nil
var someClass: AnyClass? = nil
```

Much cleaner. Swift's `nil` isn't a pointer to address zero - it's a special state in the optional enum. But when bridging to Objective-C, Swift knows how to convert:

- Swift `nil` → Objective-C `nil`
- Objective-C `nil` → Swift `nil`
- Objective-C `NSNull` → stays `NSNull` (it's an object)

The `NSNull` situation can still trip you up in Swift:

```swift
// From an Objective-C API
let data = someAPI.getUserData() as? [String]

// If the ObjC side uses NSNull, you might get:
// ["John", NSNull(), "Jane"]

// This will crash:
let name = data[1] as! String  // NSNull is not a String

// Better:
if let name = data[1] as? String {
    print(name)
} else {
    print("Name is null")
}
```

## When to use each one

Here's my rule of thumb:

**nil** - For Objective-C objects and Swift optionals
```objective-c
NSString *text = nil;
```
```swift
var text: String? = nil
```

**Nil** - For Class pointers in Objective-C (rare)
```objective-c
Class myClass = Nil;
```

**NULL** - For C pointers in Objective-C code
```objective-c
void *buffer = NULL;
int *numbers = NULL;
```

**NSNull** - When you need a "null object" in collections
```objective-c
NSArray *items = @[[NSNull null], @"data"];
```
```swift
let items: [Any] = [NSNull(), "data"]
```

## A common mistake

I've seen this pattern many times (and written it myself):

```objective-c
// Wrong
if (someObject != NULL) {
    [someObject doSomething];
}

// Better - use nil for objects
if (someObject != nil) {
    [someObject doSomething];
}

// Even better in modern Objective-C
if (someObject) {
    [someObject doSomething];
}
```

The compiler won't complain if you mix them up, but using the right one makes your intent clearer and helps future readers understand your code.

## Why it matters

You might think "they're all zero anyway, who cares?" And technically you're right. But these distinctions help with:

1. **Code readability** - `nil` says "object", `NULL` says "C pointer"
2. **Intent signaling** - Makes your code's purpose clearer
3. **Bridging** - Helps when working between C, Objective-C, and Swift
4. **Static analysis** - Tools can better understand your code

Plus, when you see `NSNull` in code, you know immediately that you're dealing with a collection that might have intentional gaps.

## Wrapping up

The different null values in iOS exist because of the language's evolution:
- `NULL` from C (generic pointer)
- `nil` from Objective-C (object pointer)
- `Nil` from Objective-C (class pointer)
- `NSNull` from Foundation (null object for collections)

Swift simplified this down to just `nil` and optionals, but if you work with Objective-C or bridge between languages, you'll see all of them. Now you know why they exist and when to use each one.

It's one of those things that seems overly complicated at first, but once you understand the history, it actually makes sense.
