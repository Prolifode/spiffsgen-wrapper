# SPIFFS Generation Wrapper

A TypeScript wrapper for generating and unpacking SPIFFS images using [spiffsgen.py](https://github.com/espressif/esp-idf/blob/v5.3.1/components/spiffs/spiffsgen.py)

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
    - [Packing a Directory](#packing-a-directory)
- [Configuration](#configuration)
- [License](#license)

## Overview

This wrapper provides an easy-to-use interface for creating and unpacking SPIFFS images with the help of `spiffsgen.py`. It determines the correct executable path based on the platform, ensures the script is executable, and simplifies command execution.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- Python (version 3.x) installed and available in the system's PATH
- `spiffsgen.py` should be available in the `bin` directory or in the specified location in the script

## Installation

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/your-repo/spiffs-gen-wrapper.git
cd spiffs-gen-wrapper
```

## Install the dependencies:

```bash
npm install
```

## Usage

## Packing a Directory
Use the pack method to create a SPIFFS image from a directory:

```typescript
import SpiffsGen from './src/SpiffsGen';

const spiffsGen = new SpiffsGen();

spiffsGen.pack(
    './data',               // Source directory
    'spiffs.bin',           // Output file
    { blockSize: 4096, pageSize: 256, spiffSize: 131072 }, // Options
    (error, stdout) => {
        if (error) {
            console.error('Failed to create SPIFFS image:', error);
        } else {
            console.log('SPIFFS image created successfully:', stdout);
        }
    }
);

```

## Configuration
### Options for Packing
- `blockSize`: The block size in bytes (default: 4096)
- `pageSize`: The page size in bytes (default: 256)
- `spiffSize`: The total size of the SPIFFS image in bytes (e.g., 131072 for 128 KB)

## Example Configuration

To use different options for generating a SPIFFS image:

```typescript
const options = {
    blockSize: 8192,       // Block size
    pageSize: 512,         // Page size
    spiffSize: 262144,     // Image size
};
```

## License

This project is licensed under the [MIT](https://github.com/Prolifode/spiffsgen-wrapper/blob/main/LICENSE) License
