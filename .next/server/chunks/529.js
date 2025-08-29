"use strict";
exports.id = 529;
exports.ids = [529];
exports.modules = {

/***/ 80300:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    PageSignatureError: function() {
        return PageSignatureError;
    },
    RemovedPageError: function() {
        return RemovedPageError;
    },
    RemovedUAError: function() {
        return RemovedUAError;
    }
});
class PageSignatureError extends Error {
    constructor({ page  }){
        super(`The middleware "${page}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
    }
}
class RemovedPageError extends Error {
    constructor(){
        super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
    }
}
class RemovedUAError extends Error {
    constructor(){
        super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
    }
} //# sourceMappingURL=error.js.map


/***/ }),

/***/ 67779:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
Object.defineProperty(exports, "E", ({
    enumerable: true,
    get: function() {
        return ImageResponse;
    }
}));
class ImageResponse {
    constructor(...args){
        // @ts-expect-error - process.turbopack is a custom property
        if (process.turbopack) {
            // TODO(sokra) enable this again when turbopack supports wasm
            throw new Error("Turbopack doesn't support ImageResponse currently");
        } else {
            const readable = new ReadableStream({
                async start (controller) {
                    const OGImageResponse = // as the auto resolving is not working
                    (await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 14021))).ImageResponse;
                    const imageResponse = new OGImageResponse(...args);
                    if (!imageResponse.body) {
                        return controller.close();
                    }
                    const reader = imageResponse.body.getReader();
                    while(true){
                        const { done , value  } = await reader.read();
                        if (done) {
                            return controller.close();
                        }
                        controller.enqueue(value);
                    }
                }
            });
            const options = args[1] || {};
            return new Response(readable, {
                headers: {
                    "content-type": "image/png",
                    "cache-control":  false ? 0 : "public, immutable, no-transform, max-age=31536000",
                    ...options.headers
                },
                status: options.status,
                statusText: options.statusText
            });
        }
    }
} //# sourceMappingURL=image-response.js.map


/***/ }),

/***/ 22091:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    INTERNALS: function() {
        return INTERNALS;
    },
    NextRequest: function() {
        return NextRequest;
    }
});
const _nexturl = __webpack_require__(54576);
const _utils = __webpack_require__(3547);
const _error = __webpack_require__(80300);
const _cookies = __webpack_require__(8306);
const INTERNALS = Symbol("internal request");
class NextRequest extends Request {
    constructor(input, init = {}){
        const url = typeof input !== "string" && "url" in input ? input.url : String(input);
        (0, _utils.validateURL)(url);
        super(url, init);
        const nextUrl = new _nexturl.NextURL(url, {
            headers: (0, _utils.toNodeHeaders)(this.headers),
            nextConfig: init.nextConfig
        });
        this[INTERNALS] = {
            cookies: new _cookies.RequestCookies(this.headers),
            geo: init.geo || {},
            ip: init.ip,
            nextUrl,
            url:  false ? 0 : nextUrl.toString()
        };
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            cookies: this.cookies,
            geo: this.geo,
            ip: this.ip,
            nextUrl: this.nextUrl,
            url: this.url,
            // rest of props come from Request
            bodyUsed: this.bodyUsed,
            cache: this.cache,
            credentials: this.credentials,
            destination: this.destination,
            headers: Object.fromEntries(this.headers),
            integrity: this.integrity,
            keepalive: this.keepalive,
            method: this.method,
            mode: this.mode,
            redirect: this.redirect,
            referrer: this.referrer,
            referrerPolicy: this.referrerPolicy,
            signal: this.signal
        };
    }
    get cookies() {
        return this[INTERNALS].cookies;
    }
    get geo() {
        return this[INTERNALS].geo;
    }
    get ip() {
        return this[INTERNALS].ip;
    }
    get nextUrl() {
        return this[INTERNALS].nextUrl;
    }
    /**
   * @deprecated
   * `page` has been deprecated in favour of `URLPattern`.
   * Read more: https://nextjs.org/docs/messages/middleware-request-page
   */ get page() {
        throw new _error.RemovedPageError();
    }
    /**
   * @deprecated
   * `ua` has been removed in favour of \`userAgent\` function.
   * Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
   */ get ua() {
        throw new _error.RemovedUAError();
    }
    get url() {
        return this[INTERNALS].url;
    }
} //# sourceMappingURL=request.js.map


/***/ }),

/***/ 66843:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
Object.defineProperty(exports, "x", ({
    enumerable: true,
    get: function() {
        return NextResponse;
    }
}));
const _nexturl = __webpack_require__(54576);
const _utils = __webpack_require__(3547);
const _cookies = __webpack_require__(8306);
const INTERNALS = Symbol("internal response");
const REDIRECTS = new Set([
    301,
    302,
    303,
    307,
    308
]);
function handleMiddlewareField(init, headers) {
    var _init_request;
    if (init == null ? void 0 : (_init_request = init.request) == null ? void 0 : _init_request.headers) {
        if (!(init.request.headers instanceof Headers)) {
            throw new Error("request.headers must be an instance of Headers");
        }
        const keys = [];
        for (const [key, value] of init.request.headers){
            headers.set("x-middleware-request-" + key, value);
            keys.push(key);
        }
        headers.set("x-middleware-override-headers", keys.join(","));
    }
}
class NextResponse extends Response {
    constructor(body, init = {}){
        super(body, init);
        this[INTERNALS] = {
            cookies: new _cookies.ResponseCookies(this.headers),
            url: init.url ? new _nexturl.NextURL(init.url, {
                headers: (0, _utils.toNodeHeaders)(this.headers),
                nextConfig: init.nextConfig
            }) : undefined
        };
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            cookies: this.cookies,
            url: this.url,
            // rest of props come from Response
            body: this.body,
            bodyUsed: this.bodyUsed,
            headers: Object.fromEntries(this.headers),
            ok: this.ok,
            redirected: this.redirected,
            status: this.status,
            statusText: this.statusText,
            type: this.type
        };
    }
    get cookies() {
        return this[INTERNALS].cookies;
    }
    static json(body, init) {
        // @ts-expect-error This is not in lib/dom right now, and we can't augment it.
        const response = Response.json(body, init);
        return new NextResponse(response.body, response);
    }
    static redirect(url, init) {
        const status = typeof init === "number" ? init : (init == null ? void 0 : init.status) ?? 307;
        if (!REDIRECTS.has(status)) {
            throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        const initObj = typeof init === "object" ? init : {};
        const headers = new Headers(initObj == null ? void 0 : initObj.headers);
        headers.set("Location", (0, _utils.validateURL)(url));
        return new NextResponse(null, {
            ...initObj,
            headers,
            status
        });
    }
    static rewrite(destination, init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set("x-middleware-rewrite", (0, _utils.validateURL)(destination));
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
    static next(init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set("x-middleware-next", "1");
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
} //# sourceMappingURL=response.js.map


/***/ }),

/***/ 14521:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
Object.defineProperty(exports, "A", ({
    enumerable: true,
    get: function() {
        return unstable_cache;
    }
}));
function unstable_cache(cb, keyParts, options) {
    const joinedKey = cb.toString() + "-" + keyParts.join(", ");
    const staticGenerationAsyncStorage = fetch.__nextGetStaticStore == null ? void 0 : fetch.__nextGetStaticStore();
    const store = staticGenerationAsyncStorage == null ? void 0 : staticGenerationAsyncStorage.getStore();
    if (!store || !store.incrementalCache) {
        throw new Error(`Invariant: static generation store missing in unstable_cache ${joinedKey}`);
    }
    if (options.revalidate === 0) {
        throw new Error(`Invariant revalidate: 0 can not be passed to unstable_cache(), must be "false" or "> 0" ${joinedKey}`);
    }
    return async (...args)=>{
        // We override the default fetch cache handling inside of the
        // cache callback so that we only cache the specific values returned
        // from the callback instead of also caching any fetches done inside
        // of the callback as well
        return staticGenerationAsyncStorage == null ? void 0 : staticGenerationAsyncStorage.run({
            ...store,
            fetchCache: "only-no-store"
        }, async ()=>{
            var _store_incrementalCache, _store_incrementalCache1;
            const cacheKey = await ((_store_incrementalCache = store.incrementalCache) == null ? void 0 : _store_incrementalCache.fetchCacheKey(joinedKey));
            const cacheEntry = cacheKey && !store.isOnDemandRevalidate && await ((_store_incrementalCache1 = store.incrementalCache) == null ? void 0 : _store_incrementalCache1.get(cacheKey, true, options.revalidate));
            const invokeCallback = async ()=>{
                const result = await cb(...args);
                if (cacheKey && store.incrementalCache) {
                    await store.incrementalCache.set(cacheKey, {
                        kind: "FETCH",
                        data: {
                            headers: {},
                            // TODO: handle non-JSON values?
                            body: JSON.stringify(result),
                            status: 200,
                            tags: options.tags
                        },
                        revalidate: options.revalidate
                    }, options.revalidate, true);
                }
                return result;
            };
            if (!cacheEntry || !cacheEntry.value) {
                return invokeCallback();
            }
            if (cacheEntry.value.kind !== "FETCH") {
                console.error(`Invariant invalid cacheEntry returned for ${joinedKey}`);
                return invokeCallback();
            }
            let cachedValue;
            const isStale = cacheEntry.isStale;
            if (cacheEntry) {
                const resData = cacheEntry.value.data;
                cachedValue = JSON.parse(resData.body);
            }
            const currentTags = cacheEntry.value.data.tags;
            if (isStale) {
                if (!store.pendingRevalidates) {
                    store.pendingRevalidates = [];
                }
                store.pendingRevalidates.push(invokeCallback().catch((err)=>console.error(`revalidating cache with key: ${joinedKey}`, err)));
            } else if (options.tags && !options.tags.every((tag)=>{
                return currentTags == null ? void 0 : currentTags.includes(tag);
            })) {
                var _store_incrementalCache2;
                if (!cacheEntry.value.data.tags) {
                    cacheEntry.value.data.tags = [];
                }
                for (const tag of options.tags){
                    if (!cacheEntry.value.data.tags.includes(tag)) {
                        cacheEntry.value.data.tags.push(tag);
                    }
                }
                (_store_incrementalCache2 = store.incrementalCache) == null ? void 0 : _store_incrementalCache2.set(cacheKey, cacheEntry.value, options.revalidate, true);
            }
            return cachedValue;
        });
    };
} //# sourceMappingURL=unstable-cache.js.map


/***/ }),

/***/ 63789:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
Object.defineProperty(exports, "x", ({
    enumerable: true,
    get: function() {
        return unstable_revalidatePath;
    }
}));
const _headers = __webpack_require__(904);
const _constants = __webpack_require__(72523);
function unstable_revalidatePath(path, ctx = {}) {
    var _store_incrementalCache, _store_incrementalCache_prerenderManifest, _store_incrementalCache_prerenderManifest_preview, _store_incrementalCache1, _store_incrementalCache2, _store_incrementalCache3;
    const staticGenerationAsyncStorage = fetch.__nextGetStaticStore == null ? void 0 : fetch.__nextGetStaticStore();
    const store = staticGenerationAsyncStorage == null ? void 0 : staticGenerationAsyncStorage.getStore();
    if (!store) {
        throw new Error(`Invariant: static generation store missing in unstable_revalidatePath ${path}`);
    }
    if (!store.pendingRevalidates) {
        store.pendingRevalidates = [];
    }
    const previewModeId = ((_store_incrementalCache = store.incrementalCache) == null ? void 0 : (_store_incrementalCache_prerenderManifest = _store_incrementalCache.prerenderManifest) == null ? void 0 : (_store_incrementalCache_prerenderManifest_preview = _store_incrementalCache_prerenderManifest.preview) == null ? void 0 : _store_incrementalCache_prerenderManifest_preview.previewModeId) || undefined;
    const reqHeaders = ((_store_incrementalCache1 = store.incrementalCache) == null ? void 0 : _store_incrementalCache1.requestHeaders) || Object.fromEntries((0, _headers.headers)());
    const host = reqHeaders["host"];
    const proto = ((_store_incrementalCache2 = store.incrementalCache) == null ? void 0 : _store_incrementalCache2.requestProtocol) || "https";
    // TODO: glob handling + blocking/soft revalidate
    const revalidateURL = `${proto}://${host}${path}`;
    const revalidateHeaders = {
        [_constants.PRERENDER_REVALIDATE_HEADER]: previewModeId,
        ...ctx.unstable_onlyGenerated ? {
            [_constants.PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER]: "1"
        } : {}
    };
    const curAllowedRevalidateHeaderKeys = ((_store_incrementalCache3 = store.incrementalCache) == null ? void 0 : _store_incrementalCache3.allowedRevalidateHeaderKeys) || undefined;
    const allowedRevalidateHeaderKeys = [
        ...curAllowedRevalidateHeaderKeys || [],
        ...!store.incrementalCache ? [
            "cookie",
            "x-vercel-protection-bypass"
        ] : []
    ];
    for (const key of Object.keys(reqHeaders)){
        if (allowedRevalidateHeaderKeys.includes(key)) {
            revalidateHeaders[key] = reqHeaders[key];
        }
    }
    const fetchIPv4v6 = (v6 = false)=>{
        const curUrl = new URL(revalidateURL);
        const hostname = curUrl.hostname;
        if (!v6 && hostname === "localhost") {
            curUrl.hostname = "127.0.0.1";
        }
        return fetch(curUrl, {
            method: "HEAD",
            headers: revalidateHeaders
        }).then((res)=>{
            const cacheHeader = res.headers.get("x-vercel-cache") || res.headers.get("x-nextjs-cache");
            if ((cacheHeader == null ? void 0 : cacheHeader.toLowerCase()) !== "revalidated") {
                throw new Error(`received invalid response ${res.status} ${cacheHeader}`);
            }
        }).catch((err)=>{
            if (err.code === "ECONNREFUSED" && !v6) {
                return fetchIPv4v6(true);
            }
            console.error(`revalidatePath failed for ${revalidateURL}`, err);
        });
    };
    store.pendingRevalidates.push(fetchIPv4v6());
} //# sourceMappingURL=unstable-revalidate-path.js.map


/***/ }),

/***/ 51610:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
Object.defineProperty(exports, "B", ({
    enumerable: true,
    get: function() {
        return unstable_revalidateTag;
    }
}));
function unstable_revalidateTag(tag) {
    const staticGenerationAsyncStorage = fetch.__nextGetStaticStore == null ? void 0 : fetch.__nextGetStaticStore();
    const store = staticGenerationAsyncStorage == null ? void 0 : staticGenerationAsyncStorage.getStore();
    if (!store || !store.incrementalCache) {
        throw new Error(`Invariant: static generation store missing in unstable_revalidateTag ${tag}`);
    }
    if (!store.pendingRevalidates) {
        store.pendingRevalidates = [];
    }
    store.pendingRevalidates.push(store.incrementalCache.revalidateTag == null ? void 0 : store.incrementalCache.revalidateTag(tag).catch((err)=>{
        console.error(`revalidateTag failed for ${tag}`, err);
    }));
} //# sourceMappingURL=unstable-revalidate-tag.js.map


/***/ }),

/***/ 103:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isBot: function() {
        return isBot;
    },
    userAgentFromString: function() {
        return userAgentFromString;
    },
    userAgent: function() {
        return userAgent;
    }
});
const _uaparserjs = /*#__PURE__*/ _interop_require_default(__webpack_require__(32196));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function isBot(input) {
    return /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver/i.test(input);
}
function userAgentFromString(input) {
    return {
        ...(0, _uaparserjs.default)(input),
        isBot: input === undefined ? false : isBot(input)
    };
}
function userAgent({ headers  }) {
    return userAgentFromString(headers.get("user-agent") || undefined);
} //# sourceMappingURL=user-agent.js.map


/***/ }),

/***/ 38529:
/***/ ((module, exports, __webpack_require__) => {


const serverExports = {
    NextRequest: (__webpack_require__(22091).NextRequest),
    NextResponse: (__webpack_require__(66843)/* .NextResponse */ .x),
    ImageResponse: (__webpack_require__(67779)/* .ImageResponse */ .E),
    unstable_cache: (__webpack_require__(14521)/* .unstable_cache */ .A),
    unstable_revalidateTag: (__webpack_require__(51610)/* .unstable_revalidateTag */ .B),
    unstable_revalidatePath: (__webpack_require__(63789)/* .unstable_revalidatePath */ .x),
    userAgentFromString: (__webpack_require__(103).userAgentFromString),
    userAgent: (__webpack_require__(103).userAgent)
};
if (typeof URLPattern !== "undefined") {
    // eslint-disable-next-line no-undef
    serverExports.URLPattern = URLPattern;
}
// https://nodejs.org/api/esm.html#commonjs-namespaces
// When importing CommonJS modules, the module.exports object is provided as the default export
module.exports = serverExports;
// make import { xxx } from 'next/server' work
exports.NextRequest = serverExports.NextRequest;
exports.NextResponse = serverExports.NextResponse;
exports.ImageResponse = serverExports.ImageResponse;
exports.unstable_cache = serverExports.unstable_cache;
exports.unstable_revalidatePath = serverExports.unstable_revalidatePath;
exports.unstable_revalidateTag = serverExports.unstable_revalidateTag;
exports.userAgentFromString = serverExports.userAgentFromString;
exports.userAgent = serverExports.userAgent;
exports.URLPattern = serverExports.URLPattern;


/***/ })

};
;