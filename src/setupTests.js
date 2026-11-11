import { TextDecoder, TextEncoder } from 'util';
import {
  ReadableStream as WebReadableStream,
  WritableStream as WebWritableStream,
  TransformStream as WebTransformStream,
} from 'stream/web';

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

// Polyfill web streams for cheerio/undici in jest jsdom environment
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = WebReadableStream;
  global.WritableStream = WebWritableStream;
  global.TransformStream = WebTransformStream;
}
