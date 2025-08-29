"use strict";
exports.id = 898;
exports.ids = [898];
exports.modules = {

/***/ 67898:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "O": () => (/* binding */ env)
/* harmony export */ });
/* harmony import */ var _t3_oss_env_nextjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(66210);
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(55257);


const env = (0,_t3_oss_env_nextjs__WEBPACK_IMPORTED_MODULE_0__/* .createEnv */ .D)({
    server: {
        // This is optional because it's only used in development.
        // See https://next-auth.js.org/deployment.
        NEXTAUTH_URL: zod__WEBPACK_IMPORTED_MODULE_1__/* .string */ .Z_().url().optional(),
        NEXTAUTH_SECRET: zod__WEBPACK_IMPORTED_MODULE_1__/* .string */ .Z_().min(1),
        GITHUB_CLIENT_ID: zod__WEBPACK_IMPORTED_MODULE_1__/* .string */ .Z_().min(1).optional(),
        GITHUB_CLIENT_SECRET: zod__WEBPACK_IMPORTED_MODULE_1__/* .string */ .Z_().min(1).optional(),
        GITHUB_ACCESS_TOKEN: zod__WEBPACK_IMPORTED_MODULE_1__/* .string */ .Z_().min(1).optional(),
        DATABASE_URL: zod__WEBPACK_IMPORTED_MODULE_1__/* .string */ .Z_().min(1),
        PRISMA_DATABASE_URL: zod__WEBPACK_IMPORTED_MODULE_1__/* .string */ .Z_().min(1).optional(),
        SMTP_FROM: zod__WEBPACK_IMPORTED_MODULE_1__/* .string */ .Z_().min(1).optional(),
        POSTMARK_API_TOKEN: zod__WEBPACK_IMPORTED_MODULE_1__/* .string */ .Z_().min(1).optional(),
        POSTMARK_SIGN_IN_TEMPLATE: zod__WEBPACK_IMPORTED_MODULE_1__/* .string */ .Z_().min(1).optional(),
        POSTMARK_ACTIVATION_TEMPLATE: zod__WEBPACK_IMPORTED_MODULE_1__/* .string */ .Z_().min(1).optional(),
        STRIPE_API_KEY: zod__WEBPACK_IMPORTED_MODULE_1__/* .string */ .Z_().min(1).optional(),
        STRIPE_WEBHOOK_SECRET: zod__WEBPACK_IMPORTED_MODULE_1__/* .string */ .Z_().min(1).optional(),
        STRIPE_PRO_MONTHLY_PLAN_ID: zod__WEBPACK_IMPORTED_MODULE_1__/* .string */ .Z_().min(1).optional()
    },
    client: {
        NEXT_PUBLIC_APP_URL: zod__WEBPACK_IMPORTED_MODULE_1__/* .string */ .Z_().min(1)
    },
    runtimeEnv: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
        DATABASE_URL: process.env.DATABASE_URL,
        PRISMA_DATABASE_URL: process.env.PRISMA_DATABASE_URL,
        SMTP_FROM: process.env.SMTP_FROM,
        POSTMARK_API_TOKEN: process.env.POSTMARK_API_TOKEN,
        POSTMARK_SIGN_IN_TEMPLATE: process.env.POSTMARK_SIGN_IN_TEMPLATE,
        POSTMARK_ACTIVATION_TEMPLATE: process.env.POSTMARK_ACTIVATION_TEMPLATE,
        STRIPE_API_KEY: process.env.STRIPE_API_KEY,
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
        STRIPE_PRO_MONTHLY_PLAN_ID: process.env.STRIPE_PRO_MONTHLY_PLAN_ID,
        NEXT_PUBLIC_APP_URL: "http://localhost:3000"
    }
});


/***/ })

};
;