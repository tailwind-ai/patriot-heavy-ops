"use strict";
(() => {
var exports = {};
exports.id = 990;
exports.ids = [990];
exports.modules = {

/***/ 53524:
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ 97783:
/***/ ((module) => {

module.exports = require("next/dist/compiled/@edge-runtime/cookies");

/***/ }),

/***/ 28530:
/***/ ((module) => {

module.exports = require("next/dist/compiled/@opentelemetry/api");

/***/ }),

/***/ 35547:
/***/ ((module) => {

module.exports = require("next/dist/compiled/bytes");

/***/ }),

/***/ 54426:
/***/ ((module) => {

module.exports = require("next/dist/compiled/chalk");

/***/ }),

/***/ 74929:
/***/ ((module) => {

module.exports = require("next/dist/compiled/content-type");

/***/ }),

/***/ 40252:
/***/ ((module) => {

module.exports = require("next/dist/compiled/cookie");

/***/ }),

/***/ 47664:
/***/ ((module) => {

module.exports = require("next/dist/compiled/fresh");

/***/ }),

/***/ 45644:
/***/ ((module) => {

module.exports = require("next/dist/compiled/jsonwebtoken");

/***/ }),

/***/ 27798:
/***/ ((module) => {

module.exports = require("next/dist/compiled/raw-body");

/***/ }),

/***/ 39491:
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ 14300:
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ 32081:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 9523:
/***/ ((module) => {

module.exports = require("dns");

/***/ }),

/***/ 82361:
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ 57147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 13685:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 95687:
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ 41808:
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ 22037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 71017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 63477:
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ 12781:
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ 24404:
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ 76224:
/***/ ((module) => {

module.exports = require("tty");

/***/ }),

/***/ 57310:
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ 73837:
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ 59796:
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ 60825:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "headerHooks": () => (/* binding */ headerHooks),
  "requestAsyncStorage": () => (/* binding */ requestAsyncStorage),
  "routeModule": () => (/* binding */ routeModule),
  "serverHooks": () => (/* binding */ serverHooks),
  "staticGenerationAsyncStorage": () => (/* binding */ staticGenerationAsyncStorage),
  "staticGenerationBailout": () => (/* binding */ staticGenerationBailout)
});

// NAMESPACE OBJECT: ./app/api/posts/route.ts
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  "GET": () => (GET),
  "POST": () => (POST)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(76145);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(19532);
var module_default = /*#__PURE__*/__webpack_require__.n(app_route_module);
// EXTERNAL MODULE: ./node_modules/next-auth/next/index.js
var next = __webpack_require__(91071);
// EXTERNAL MODULE: ./node_modules/zod/v3/types.js + 1 modules
var types = __webpack_require__(55257);
// EXTERNAL MODULE: ./node_modules/zod/v3/ZodError.js
var ZodError = __webpack_require__(30453);
// EXTERNAL MODULE: ./lib/auth.ts
var auth = __webpack_require__(53439);
// EXTERNAL MODULE: ./lib/db.ts
var db = __webpack_require__(49761);
;// CONCATENATED MODULE: ./lib/exceptions.ts
class RequiresProPlanError extends Error {
    constructor(message = "This action requires a pro plan"){
        super(message);
    }
}

// EXTERNAL MODULE: ./lib/subscription.ts
var subscription = __webpack_require__(71375);
;// CONCATENATED MODULE: ./app/api/posts/route.ts






const postCreateSchema = types/* object */.Ry({
    title: types/* string */.Z_(),
    content: types/* string */.Z_().optional()
});
async function GET() {
    try {
        const session = await (0,next.getServerSession)(auth/* authOptions */.L);
        if (!session) {
            return new Response("Unauthorized", {
                status: 403
            });
        }
        const { user  } = session;
        const posts = await db.db.post.findMany({
            select: {
                id: true,
                title: true,
                published: true,
                createdAt: true
            },
            where: {
                authorId: user.id
            }
        });
        return new Response(JSON.stringify(posts));
    } catch (error) {
        return new Response(null, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const session = await (0,next.getServerSession)(auth/* authOptions */.L);
        if (!session) {
            return new Response("Unauthorized", {
                status: 403
            });
        }
        const { user  } = session;
        const subscriptionPlan = await (0,subscription/* getUserSubscriptionPlan */.b)(user.id);
        // If user is on a free plan.
        // Check if user has reached limit of 3 posts.
        if (!subscriptionPlan?.isPro) {
            const count = await db.db.post.count({
                where: {
                    authorId: user.id
                }
            });
            if (count >= 3) {
                throw new RequiresProPlanError();
            }
        }
        const json = await req.json();
        const body = postCreateSchema.parse(json);
        const post = await db.db.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: session.user.id
            },
            select: {
                id: true
            }
        });
        return new Response(JSON.stringify(post));
    } catch (error) {
        if (error instanceof ZodError/* ZodError */.jm) {
            return new Response(JSON.stringify(error.issues), {
                status: 422
            });
        }
        if (error instanceof RequiresProPlanError) {
            return new Response("Requires Pro Plan", {
                status: 402
            });
        }
        return new Response(null, {
            status: 500
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fposts%2Froute&name=app%2Fapi%2Fposts%2Froute&pagePath=private-next-app-dir%2Fapi%2Fposts%2Froute.ts&appDir=%2FUsers%2Fsamhenry%2Fpatriot-heavy-ops%2Fpatriot-heavy-ops%2Fapp&appPaths=%2Fapi%2Fposts%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&assetPrefix=&nextConfigOutput=&preferredRegion=!

    

    

    

    const routeModule = new (module_default())({
    userland: route_namespaceObject,
    pathname: "/api/posts",
    resolvedPagePath: "/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/app/api/posts/route.ts",
    nextConfigOutput: undefined,
  })

    // Pull out the exports that we need to expose from the module. This should
    // be eliminated when we've moved the other routes to the new format. These
    // are used to hook into the route.
    const {
      requestAsyncStorage,
      staticGenerationAsyncStorage,
      serverHooks,
      headerHooks,
      staticGenerationBailout
    } = routeModule

    

/***/ }),

/***/ 7506:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "J": () => (/* binding */ siteConfig)
/* harmony export */ });
const siteConfig = {
    name: "Taxonomy",
    description: "An open source application built using the new router, server components and everything new in Next.js 13.",
    url: "https://tx.shadcn.com",
    ogImage: "https://tx.shadcn.com/og.jpg",
    links: {
        twitter: "https://twitter.com/shadcn",
        github: "https://github.com/shadcn/taxonomy"
    }
};


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [536,210,198,904,468,601,898,439,375], () => (__webpack_exec__(60825)));
module.exports = __webpack_exports__;

})();