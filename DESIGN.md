# xrays design

## Table of Contents

- [xrays design](#xrays-design)
  - [Table of Contents](#table-of-contents)
  - [What does this package do?](#what-does-this-package-do)
  - [How is it different from what I already use?](#how-is-it-different-from-what-i-already-use)
    - [Promise Chaining](#promise-chaining)
    - [`try / catch` with `async / await`](#try--catch-with-async--await)
    - [What `xrays` does differently](#what-xrays-does-differently)
    - [Comparison Table for Resource CRUD Scenario](#comparison-table-for-resource-crud-scenario)
  - [Why should I adopt it?](#why-should-i-adopt-it)
  - [How do I contribute to this package?](#how-do-i-contribute-to-this-package)
  - [How do I adopt this design in my framework, language, etc.?](#how-do-i-adopt-this-design-in-my-framework-language-etc)

## What does this package do?

`xrays` is designed to catch errors thrown by async functions.

`xrays` has a few simple goals

1. Reduce total lines of code up to 50% *`North Star Metric`*
2. Reduce total levels of nesting up to 30%
3. Improve developer happiness up to by 20%

## How is it different from what I already use?

Today, there are a two main patterns used for error handling of async functions in JavaScript & Typescript.

1. `Promise Chaining`
2. `try / catch` with `async / await`

### Promise Chaining

Basic Promise Chaining works as such:
**3 Lines of Code Below, 1 Level of Nesting**

```typescript
// An Example of Basic Promise Chaining
asyncFunction()
  .then((value) => { console.log(value) })
  .catch((error) => { console.log('Whoops Ran into an Error') })
```

While it can work well for simple use cases, it has **2 major drawbacks**

The first is that dependent async function calls requires deeply nested code, even without Error Handling.

The following scenario provides a great practical example:

```md
Scenario — Resource CRUD
1. Make a Search API Call to Search for an Existing Resource
2. Choose if we should Create a New Resource (Insert) or Update an Existing One (Update)
3. Notify Websocket Subscribers via Push about New Resource Information
```

Promise Chaining without Error Handling:
**17 Lines of Code Below, 6 Levels of Nesting**

```typescript
// An Example of Promise Chaining without Error Handling for the Resource CRUD Scenario
searchAPICall()
  .then((searchData) => {
    if (shouldCreateNewResource(searchData)) {
      insertAPICall(searchData).then((insertResponse) => {
        pushToSubscribers(insertResponse)
          .then((subscriberResponses) => {
            console.log(subscriberResponses);
          });
      });
    } else {
      updateAPICall(searchData).then((updateResponse) => {
        pushToSubscribers(updateResponse)
          .then((subscriberResponses) => {
            console.log(subscriberResponses);
          });
      });
    }
  });
```

Adding error handling to each async call to send proper error messages to users results in further nested complexity.

Promise Chaining with Error Handling:
**32 Lines of Code Below, 6 Levels of Nesting**

```typescript
// An Example of Promise Chaining with Error Handling for the Resource CRUD Scenario
searchAPICall()
  .then((searchData) => {
    if (shouldCreateNewResource(searchData)) {
      insertAPICall(searchData).then((insertResponse) => {
        pushToSubscribers(insertResponse)
          .then((subscriberResponses) => {
            console.log(subscriberResponses);
          })
          .catch((pushError) => {
            sendErrorResponseToUser('Push Error', pushError);
          });
      })
      .catch((insertError) => {
        sendErrorResponseToUser('Insert Error', insertError);
      });
    } else {
      updateAPICall(searchData).then((updateResponse) => {
        pushToSubscribers(updateResponse)
          .then((subscriberResponses) => {
            console.log(subscriberResponses);
          })
          .catch((pushError) => {
            sendErrorResponseToUser('Push Error', pushError);
          });
      })
      .catch((updateError) => {
        sendErrorResponseToUser('Update Error', updateError);
      });
    }
  })
  .catch((searchError) => {
    sendErrorResponseToUser('Search Error', searchError);
  });
```

### `try / catch` with `async / await`

Basic `try / catch` with `async / await` works as such:
**6 Lines of Code Below, 1 Level of Nesting**

```typescript
// An Basic Example of try / catch with async / await
try {
  const value = await asyncFunction();
  console.log(value);
} catch (error) {
  console.log('Whoops Ran into an Error');
}
```

`try / catch` with `async / await` suffers from the same drawbacks as `Promise Chaining` but to a lesser degree.

`try / catch` & `async / await` without Error Handling:
**10 Lines of Code Below, 1 Level of Nesting**

```typescript
// An Example of try / catch with async / await without Error Handling for the Resource CRUD Scenario
const searchData = await searchAPICall();
let insertResponse, updateResponse;
if (shouldCreateNewResource(searchData)) {
  insertResponse = await insertAPICall(searchData);
  const subscriberResponses = await pushToSubscribers(insertResponse);
  console.log(subscriberResponses);
} else {
  updateResponse = await updateAPICall(searchData);
  const subscriberResponses = await pushToSubscribers(updateResponse);
  console.log(subscriberResponses);
}
```

`try / catch` & `async / await` with Error Handling:
**30 Lines of Code Below, 3 Levels of Nesting**

```typescript
// An Example of try / catch with async / await with Error Handling for the Resource CRUD Scenario
try {
  const searchData = await searchAPICall();
  if (shouldCreateNewResource(searchData)) {
    try {
      const insertResponse = await insertAPICall(searchData);
    } catch (insertError) {
      sendErrorResponseToUser('Insert Error', insertError);
    }
    try {
      const subscriberResponses = await pushToSubscribers(insertResponse);
      console.log(subscriberResponses);
    } catch (pushError) {
      sendErrorResponseToUser('Push Error', pushError);
    }
  } else {
    try {
      const updateResponse = await updateAPICall(searchData);
    } catch (updateError) {
      sendErrorResponseToUser('Update Error', updateError);
    }
    try {
      const subscriberResponses = await pushToSubscribers(updateResponse);
      console.log(subscriberResponses);
    } catch (pushError) {
      sendErrorResponseToUser('Push Error', pushError);
    }
  }
} catch (searchError) {
  sendErrorResponseToUser('Search Error', searchError);
}
```

### What `xrays` does differently

A basic call with `xrays` works as such:
**3 Lines of Code Below, 0 Levels of Nesting**

```typescript
// A Basic Example of xrays
const { data: value, error } = await x(asyncFunction);
if (error) console.log('Whoops Ran into an Error');
console.log(value);
```

The benefits of `xrays` scale to the use cases where `Promise Chaining` & `try / catch` with `async / await` fail.

`xrays` without Error Handling:
**10 Lines of Code Below, 1 Level of Nesting**

```typescript
// An Example of xrays without Error Handling for the Resource CRUD Scenario
const { data: searchData } = await x(searchAPICall);
if (shouldCreateNewResource(searchData)) {
  const { data: insertResponse } = await x(insertAPICall, searchData);
  const { data: subscriberResponses } = await x(pushToSubscribers, insertResponse);
  console.log(subscriberResponses);
} else {
  const { data: updateResponse } = await x(updateAPICall, searchData);
  const { data: subscriberResponses } = await x(pushToSubscribers, updateResponse);
  console.log(subscriberResponses);
}
```

`xrays` with Error Handling:
**15 Lines of Code Below, 1 Level of Nesting**

```typescript
// An Example of xrays with Error Handling for the Resource CRUD Scenario
const { data: searchData, error: searchError } = await x(searchAPICall);
if (searchError) sendErrorResponseToUser('Search Error', searchError);
if (shouldCreateNewResource(searchData)) {
  const { data: insertResponse, error: insertError } = await x(insertAPICall, searchData);
  if (insertError) sendErrorResponseToUser('Insert Error', insertError);
  const { data: subscriberResponses, error: pushError } = await x(pushToSubscribers, insertResponse);
  if (pushError) sendErrorResponseToUser('Push Error', pushError);
  console.log(subscriberResponses);
} else {
  const { data: updateResponse, error: updateError } = await x(updateAPICall, searchData);
  if (updateError) sendErrorResponseToUser('Update Error', updateError);
  const { data: subscriberResponses, error: pushError } = await x(pushToSubscribers, updateResponse);
  if (pushError) sendErrorResponseToUser('Push Error', pushError);
  console.log(subscriberResponses);
}
```

> Writing Code with Error Handling uses less lines of code than Promise Chaining uses without Error Handling for the same functionality.

### Comparison Table for Resource CRUD Scenario

| Error Handling Pattern |  LoC  |  LoN  | LoC w/ Error Handling | LoN w/ Error Handling |
| ---------------------- | :---: | :---: | :-------------------: | :-------------------: |
| `Promise Chaining`     |  17   |   6   |          32           |           6           |
| `try / catch`          |  10   |   1   |          30           |           3           |
| `xrays`                |  10   |   1   |          15           |           1           |

`LoC` = Lines of Code
`LoN` = Levels of Nesting

## Why should I adopt it?

The npm that makes your life simple when writing error handling code.

`xrays` catches errors before they become fatal using 3F principle :

1. **Fail-Fast Pattern** that Processes Errors before Data
2. **Flattened Error Handling** with just 1 Level of Nesting
3. **Friendly Error Messages** and simpler error handling logic

`xrays` is not just for new projects, it makes your existing code better:

1. Fractional Effort (and LoC) to add missing Error Handling
2. Fast Refactoring through the use of Consistent Syntax

## How do I contribute to this package?

`xrays` is a part of the [Open Source Universe](https://github.com/intellibus/approach). All Projects in the [Open Source Universe](https://github.com/intellibus/approach) follow the same [Contribution Guidelines & Process](https://github.com/intellibus/approach).

We would love for you to contribute to the [Open Source Universe](https://github.com/intellibus/approach)!

Also check out the [rewards](https://github.com/intellibus/approach/blob/main/REWARDS.md) offered for contributing to the [Open Source Universe](https://github.com/intellibus/approach).

## How do I adopt this design in my framework, language, etc.?

`xrays` only plans to initially support Typescript & JavaScript Applications. However, we would love for the community to contribute versions for other languages (Java, Go, etc.)

When creating an implementation for another language, we encourage that the implementation follow the [Open Source Universe](https://github.com/intellibus/approach) Principles & follows the same design (this document) & specifications (unit tests) as the Typescript & JavaScript Implementation.
