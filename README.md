# xrays

![Xrays — Catch Errors before they become Fatal](assets/xrays.png)

> An [Open Source Universe](https://github.com/intellibus/approach) Project

---

## Contents

- [xrays](#xrays)
  - [Contents](#contents)
  - [Features ✨](#features-)
  - [Install 🛠](#install-)
  - [Usage 🔭](#usage-)
  - [Documentation 🛰](#documentation-)
  - [Contributing 🌎](#contributing-)
  - [License ⚖️](#license-️)

## Features ✨

- Catches Errors Before they become Fatal
- 0 Dependencies
- Typescript Support

## Install 🛠

```sh
npm install xrays
```

## Usage 🔭

Read more about the [Design](https://github.com/intellibus/xrays/blob/main/DESIGN.md) behind `xrays` here.

```typescript
import { x } from 'xrays';

const throwable = async (shouldThrow: boolean) => {
  if (shouldThrow) {
    throw new Error('error');
  }
  return 'success';
}

const { data, error } = await x(throwable, false);
// { data: 'success', error: null }

const { data, error } = await x(throwable, true);
// { data: null, error: Error('error') }
```

## Documentation 🛰

`xrays` *is under active development, documentation will be added once an initial release is ready.*

## Contributing 🌎

We would love for you to contribute your ideas, code, & fixes to `xrays`.

We encourage everyone to read our [Design Document](https://github.com/intellibus/xrays/blob/main/DESIGN.md) to learn more about the thought process behind xrays.

Also check out the [rewards](https://github.com/intellibus/approach/blob/main/REWARDS.md) offered for contributing to the [Open Source Universe](https://github.com/intellibus/approach).

## License ⚖️

MIT
