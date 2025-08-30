"use strict";
(() => {
var exports = {};
exports.id = 770;
exports.ids = [770];
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

/***/ 24993:
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

// NAMESPACE OBJECT: ./app/api/users/stripe/route.ts
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  "GET": () => (GET)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(76145);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(19532);
var module_default = /*#__PURE__*/__webpack_require__.n(app_route_module);
// EXTERNAL MODULE: ./node_modules/next-auth/next/index.js
var next = __webpack_require__(91071);
// EXTERNAL MODULE: ./node_modules/zod/v3/ZodError.js
var ZodError = __webpack_require__(30453);
// EXTERNAL MODULE: ./config/subscriptions.ts
var subscriptions = __webpack_require__(73436);
// EXTERNAL MODULE: ./lib/auth.ts
var auth = __webpack_require__(53439);
// EXTERNAL MODULE: ./lib/stripe.ts
var stripe = __webpack_require__(94088);
// EXTERNAL MODULE: ./lib/subscription.ts
var subscription = __webpack_require__(71375);
// EXTERNAL MODULE: ./lib/utils.ts
var utils = __webpack_require__(22213);
;// CONCATENATED MODULE: ./app/api/users/stripe/route.ts







const billingUrl = (0,utils/* absoluteUrl */.G)("/dashboard/billing");
async function GET(req) {
    try {
        const session = await (0,next.getServerSession)(auth/* authOptions */.L);
        if (!session?.user || !session?.user.email) {
            return new Response(null, {
                status: 403
            });
        }
        const subscriptionPlan = await (0,subscription/* getUserSubscriptionPlan */.b)(session.user.id);
        // The user is on the pro plan.
        // Create a portal session to manage subscription.
        if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
            const stripeSession = await stripe/* stripe.billingPortal.sessions.create */.A.billingPortal.sessions.create({
                customer: subscriptionPlan.stripeCustomerId,
                return_url: billingUrl
            });
            return new Response(JSON.stringify({
                url: stripeSession.url
            }));
        }
        // The user is on the free plan.
        // Create a checkout session to upgrade.
        const stripeSession = await stripe/* stripe.checkout.sessions.create */.A.checkout.sessions.create({
            success_url: billingUrl,
            cancel_url: billingUrl,
            payment_method_types: [
                "card"
            ],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: session.user.email,
            line_items: [
                {
                    price: subscriptions/* proPlan.stripePriceId */.H.stripePriceId,
                    quantity: 1
                }
            ],
            metadata: {
                userId: session.user.id
            }
        });
        return new Response(JSON.stringify({
            url: stripeSession.url
        }));
    } catch (error) {
        if (error instanceof ZodError/* ZodError */.jm) {
            return new Response(JSON.stringify(error.issues), {
                status: 422
            });
        }
        return new Response(null, {
            status: 500
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fusers%2Fstripe%2Froute&name=app%2Fapi%2Fusers%2Fstripe%2Froute&pagePath=private-next-app-dir%2Fapi%2Fusers%2Fstripe%2Froute.ts&appDir=%2FUsers%2Fsamhenry%2Fpatriot-heavy-ops%2Fpatriot-heavy-ops%2Fapp&appPaths=%2Fapi%2Fusers%2Fstripe%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&assetPrefix=&nextConfigOutput=&preferredRegion=!

    

    

    

    const routeModule = new (module_default())({
    userland: route_namespaceObject,
    pathname: "/api/users/stripe",
    resolvedPagePath: "/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/app/api/users/stripe/route.ts",
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


/***/ }),

/***/ 94088:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A": () => (/* binding */ stripe)
/* harmony export */ });
/* harmony import */ var stripe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(91924);
/* harmony import */ var _env_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67898);


const stripe = new stripe__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z(_env_mjs__WEBPACK_IMPORTED_MODULE_1__/* .env.STRIPE_API_KEY */ .O.STRIPE_API_KEY || "", {
    apiVersion: "2022-11-15",
    typescript: true
});


/***/ }),

/***/ 22213:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "G": () => (/* binding */ absoluteUrl),
/* harmony export */   "cn": () => (/* binding */ cn),
/* harmony export */   "p": () => (/* binding */ formatDate)
/* harmony export */ });
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(30115);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(clsx__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tailwind_merge__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(99640);
/* harmony import */ var _env_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67898);



function cn(...inputs) {
    return (0,tailwind_merge__WEBPACK_IMPORTED_MODULE_2__/* .twMerge */ .m6)((0,clsx__WEBPACK_IMPORTED_MODULE_0__.clsx)(inputs));
}
function formatDate(input) {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}
function absoluteUrl(path) {
    return `${_env_mjs__WEBPACK_IMPORTED_MODULE_1__/* .env.NEXT_PUBLIC_APP_URL */ .O.NEXT_PUBLIC_APP_URL}${path}`;
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [536,210,198,904,917,468,601,940,898,439,375], () => (__webpack_exec__(24993)));
module.exports = __webpack_exports__;

})();