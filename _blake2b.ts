// Initialization vector
const blake2bIV32: Uint32Array = new Uint32Array([
	0xF3BCC908, 0x6A09E667, 0x84CAA73B, 0xBB67AE85,
	0xFE94F82B, 0x3C6EF372, 0x5F1D36F1, 0xA54FF53A,
	0xADE682D1, 0x510E527F, 0x2B3E6C1F, 0x9B05688C,
	0xFB41BD6B, 0x1F83D9AB, 0x137E2179, 0x5BE0CD19
]);
const sigma8: readonly number[] = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
	14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
	11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4,
	7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
	9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13,
	2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9,
	12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11,
	13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
	6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5,
	10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0,
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
	14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3
];
// These are offsets into a uint64 buffer. Multiply them all by 2 to make them offsets into a uint32 buffer, because this is Javascript and we don't have uint64s
const sigma82: Uint8Array = new Uint8Array(sigma8.map((x: number): number => {
	return (x * 2);
}));
export type Blake2BAcceptDataType = string | Uint8Array;
export interface Blake2BOptions {
	data?: Blake2BAcceptDataType;
	key?: Uint8Array;
	length?: number;
	personal?: string | Uint8Array;
	salt?: string | Uint8Array;
}
function normalizeInput(input: string | Uint8Array): Uint8Array {
	return ((input instanceof Uint8Array) ? input : new TextEncoder().encode(input));
}
// 64-bit unsigned addition
// Sets v[a,a+1] += v[b,b+1]
// v should be a Uint32Array
function ADD64AA(v: Uint32Array, a: number, b: number): void {
	const o0: number = v[a] + v[b];
	let o1: number = v[a + 1] + v[b + 1];
	if (o0 >= 0x100000000) {
		o1++;
	}
	v[a] = o0;
	v[a + 1] = o1;
}
// 64-bit unsigned addition
// Sets v[a,a+1] += b
// b0 is the low 32 bits of b, b1 represents the high 32 bits
function ADD64AC(v: Uint32Array, a: number, b0: number, b1: number): void {
	let o0: number = v[a] + b0;
	if (b0 < 0) {
		o0 += 0x100000000;
	}
	let o1 = v[a + 1] + b1;
	if (o0 >= 0x100000000) {
		o1++;
	}
	v[a] = o0;
	v[a + 1] = o1;
}
// Little-endian byte access
function B2B_GET32(arr: Uint8Array, i: number): number {
	return (arr[i] ^ (arr[i + 1] << 8) ^ (arr[i + 2] << 16) ^ (arr[i + 3] << 24));
}
export class Blake2B {
	#b: Uint8Array = new Uint8Array(128);
	#c: number = 0;
	#freezed: boolean = false;
	#h: Uint32Array = new Uint32Array(16);
	#hash: Uint8Array | null = null;
	#length: number;
	#m: Uint32Array = new Uint32Array(32);
	#parameterBlock: Uint8Array = new Uint8Array([
		0,
		0,
		0,
		0, //  0: outlen, keylen, fanout, depth
		0,
		0,
		0,
		0, //  4: leaf length, sequential mode
		0,
		0,
		0,
		0, //  8: node offset
		0,
		0,
		0,
		0, // 12: node offset
		0,
		0,
		0,
		0, // 16: node depth, inner length, rfu
		0,
		0,
		0,
		0, // 20: rfu
		0,
		0,
		0,
		0, // 24: rfu
		0,
		0,
		0,
		0, // 28: rfu
		0,
		0,
		0,
		0, // 32: salt
		0,
		0,
		0,
		0, // 36: salt
		0,
		0,
		0,
		0, // 40: salt
		0,
		0,
		0,
		0, // 44: salt
		0,
		0,
		0,
		0, // 48: personal
		0,
		0,
		0,
		0, // 52: personal
		0,
		0,
		0,
		0, // 56: personal
		0,
		0,
		0,
		0 // 60: personal
	]);
	#t: number = 0;
	#v: Uint32Array = new Uint32Array(32);
	get [Symbol.toStringTag](): string {
		return "Blake2B";
	}
	constructor(input: Blake2BOptions = {}) {
		const {
			data,
			key,
			length = 64,
			personal,
			salt
		}: Blake2BOptions = input;
		if (!(Number.isSafeInteger(length) && length > 0 && length <= 64)) {
			throw new TypeError(`Parameter \`length\` is not a valid number which is integer and 1 ~ 64!`);
		}
		if (typeof key !== "undefined" && key.length > 64) {
			throw new TypeError(`Parameter \`key\` is not a valid key which length <= 64!`);
		}
		if (typeof salt !== "undefined" && salt.length !== 16) {
			throw new TypeError(`Parameter \`salt\` is not a valid key which length is 16!`);
		}
		if (typeof personal !== "undefined" && personal.length !== 16) {
			throw new TypeError(`Parameter \`personal\` is not a valid key which length is 16!`);
		}
		this.#length = length;
		this.#parameterBlock.fill(0);
		this.#parameterBlock[0] = this.#length;
		if (typeof key !== "undefined") {
			this.#parameterBlock[1] = key.length;
		}
		this.#parameterBlock[2] = 1; // Fanout
		this.#parameterBlock[3] = 1; // Depth
		if (typeof salt !== "undefined") {
			this.#parameterBlock.set(normalizeInput(salt), 32);
		}
		if (typeof personal !== "undefined") {
			this.#parameterBlock.set(normalizeInput(personal), 48);
		}
		// Initialize hash state
		for (let i: number = 0; i < 16; i++) {
			this.#h[i] = blake2bIV32[i] ^ B2B_GET32(this.#parameterBlock, i * 4);
		}
		// Key the hash if applicable
		if (typeof key !== "undefined") {
			this.update(key);
			this.#c = 128;
		}
		if (typeof data !== "undefined") {
			this.update(data);
		}
	}
	// G Mixing function
	// The ROTRs are inlined for speed
	#B2B_G(a: number, b: number, c: number, d: number, ix: number, iy: number): void {
		const x0: number = this.#m[ix];
		const x1: number = this.#m[ix + 1];
		const y0: number = this.#m[iy];
		const y1: number = this.#m[iy + 1];

		ADD64AA(this.#v, a, b); // v[a,a+1] += v[b,b+1] ... in JS we must store a uint64 as two uint32s
		ADD64AC(this.#v, a, x0, x1); // v[a, a+1] += x ... x0 is the low 32 bits of x, x1 is the high 32 bits

		// v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated to the right by 32 bits
		let xor0 = this.#v[d] ^ this.#v[a];
		let xor1 = this.#v[d + 1] ^ this.#v[a + 1];
		this.#v[d] = xor1;
		this.#v[d + 1] = xor0;

		ADD64AA(this.#v, c, d);

		// v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 24 bits
		xor0 = this.#v[b] ^ this.#v[c];
		xor1 = this.#v[b + 1] ^ this.#v[c + 1];
		this.#v[b] = (xor0 >>> 24) ^ (xor1 << 8);
		this.#v[b + 1] = (xor1 >>> 24) ^ (xor0 << 8);

		ADD64AA(this.#v, a, b);
		ADD64AC(this.#v, a, y0, y1);

		// v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated right by 16 bits
		xor0 = this.#v[d] ^ this.#v[a];
		xor1 = this.#v[d + 1] ^ this.#v[a + 1];
		this.#v[d] = (xor0 >>> 16) ^ (xor1 << 16);
		this.#v[d + 1] = (xor1 >>> 16) ^ (xor0 << 16);

		ADD64AA(this.#v, c, d);

		// v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 63 bits
		xor0 = this.#v[b] ^ this.#v[c];
		xor1 = this.#v[b + 1] ^ this.#v[c + 1];
		this.#v[b] = (xor1 >>> 31) ^ (xor0 << 1);
		this.#v[b + 1] = (xor0 >>> 31) ^ (xor1 << 1);
	}
	#compress(last: boolean = false): void {
		// Init work variables
		for (let i: number = 0; i < 16; i++) {
			this.#v[i] = this.#h[i];
			this.#v[i + 16] = blake2bIV32[i];
		}

		// Low 64 bits of offset
		this.#v[24] = this.#v[24] ^ this.#t;
		this.#v[25] = this.#v[25] ^ (this.#t / 0x100000000);
		// High 64 bits not supported, offset may not be higher than 2**53-1

		// Last block flag set?
		if (last) {
			this.#v[28] = ~this.#v[28];
			this.#v[29] = ~this.#v[29];
		}

		// Get little-endian words
		for (let i: number = 0; i < 32; i++) {
			this.#m[i] = B2B_GET32(this.#b, 4 * i);
		}

		// Twelve rounds of mixing
		// debugPrint('          m[16]', this.#m, 64)
		for (let i: number = 0; i < 12; i++) {
			// debugPrint('   (i=' + (i < 10 ? ' ' : '') + i + ') this.#v[16]', this.#v, 64)
			this.#B2B_G(0, 8, 16, 24, sigma82[i * 16 + 0], sigma82[i * 16 + 1]);
			this.#B2B_G(2, 10, 18, 26, sigma82[i * 16 + 2], sigma82[i * 16 + 3]);
			this.#B2B_G(4, 12, 20, 28, sigma82[i * 16 + 4], sigma82[i * 16 + 5]);
			this.#B2B_G(6, 14, 22, 30, sigma82[i * 16 + 6], sigma82[i * 16 + 7]);
			this.#B2B_G(0, 10, 20, 30, sigma82[i * 16 + 8], sigma82[i * 16 + 9]);
			this.#B2B_G(2, 12, 22, 24, sigma82[i * 16 + 10], sigma82[i * 16 + 11]);
			this.#B2B_G(4, 14, 16, 26, sigma82[i * 16 + 12], sigma82[i * 16 + 13]);
			this.#B2B_G(6, 8, 18, 28, sigma82[i * 16 + 14], sigma82[i * 16 + 15]);
		}
		// debugPrint('   (i=12) v[16]', this.#v, 64)

		for (let i: number = 0; i < 16; i++) {
			this.#h[i] = this.#h[i] ^ this.#v[i] ^ this.#v[i + 16];
		}
		// debugPrint('h[8]', this.#h, 64)
	}
	hash(): Uint8Array {
		this.#freezed = true;
		if (this.#hash === null) {
			this.#t += this.#c; // Mark last block offset
			while (this.#c < 128) {
				// Fill up with zeros
				this.#b[this.#c++] = 0;
			}
			this.#compress(true); // Final block flag = 1

			// Little endian convert and store
			this.#hash = new Uint8Array(this.#length);
			for (let i: number = 0; i < this.#length; i++) {
				this.#hash[i] = this.#h[i >> 2] >> (8 * (i & 3));
			}
		}
		return this.#hash;
	}
	update(data: Blake2BAcceptDataType): this {
		if (this.#freezed) {
			throw new Error(`Instance is freezed!`);
		}
		const dataFmt: Uint8Array = normalizeInput(data);
		for (const byte of dataFmt) {
			if (this.#c === 128) {
				// Buffer full?
				this.#t += this.#c; // Add counters
				this.#compress(); // Compress (not last)
				this.#c = 0; // Counter to zero
			}
			this.#b[this.#c++] = byte;
		}
		return this;
	}
}
export default Blake2B;
