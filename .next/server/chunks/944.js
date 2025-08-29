exports.id = 944;
exports.ids = [944];
exports.modules = {

/***/ 40223:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 20053, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 5438))

/***/ }),

/***/ 5438:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "UserAuthForm": () => (/* binding */ UserAuthForm)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(59483);
// EXTERNAL MODULE: ./node_modules/@hookform/resolvers/zod/dist/zod.mjs + 1 modules
var zod = __webpack_require__(89048);
// EXTERNAL MODULE: ./node_modules/next-auth/react/index.js
var react = __webpack_require__(63370);
// EXTERNAL MODULE: ./node_modules/react-hook-form/dist/index.esm.mjs
var index_esm = __webpack_require__(71031);
// EXTERNAL MODULE: ./lib/utils.ts + 1 modules
var utils = __webpack_require__(60568);
// EXTERNAL MODULE: ./node_modules/zod/v3/types.js + 1 modules
var types = __webpack_require__(81186);
;// CONCATENATED MODULE: ./lib/validations/auth.ts

const userAuthSchema = types/* object */.Ry({
    email: types/* string */.Z_().email()
});

// EXTERNAL MODULE: ./components/ui/button.tsx
var ui_button = __webpack_require__(98302);
// EXTERNAL MODULE: ./components/ui/input.tsx
var input = __webpack_require__(11152);
// EXTERNAL MODULE: ./components/ui/label.tsx
var label = __webpack_require__(88727);
// EXTERNAL MODULE: ./components/ui/use-toast.ts
var use_toast = __webpack_require__(69057);
// EXTERNAL MODULE: ./components/icons.tsx
var icons = __webpack_require__(79942);
;// CONCATENATED MODULE: ./components/user-auth-form.tsx
/* __next_internal_client_entry_do_not_use__ UserAuthForm auto */ 












function UserAuthForm({ className , ...props }) {
    const { register , handleSubmit , formState: { errors  }  } = (0,index_esm/* useForm */.cI)({
        resolver: (0,zod/* zodResolver */.F)(userAuthSchema)
    });
    const [isLoading, setIsLoading] = react_.useState(false);
    const [isGitHubLoading, setIsGitHubLoading] = react_.useState(false);
    const searchParams = (0,navigation.useSearchParams)();
    async function onSubmit(data) {
        setIsLoading(true);
        const signInResult = await (0,react.signIn)("email", {
            email: data.email.toLowerCase(),
            redirect: false,
            callbackUrl: searchParams?.get("from") || "/dashboard"
        });
        setIsLoading(false);
        if (!signInResult?.ok) {
            return (0,use_toast/* toast */.Am)({
                title: "Something went wrong.",
                description: "Your sign in request failed. Please try again.",
                variant: "destructive"
            });
        }
        return (0,use_toast/* toast */.Am)({
            title: "Check your email",
            description: "We sent you a login link. Be sure to check your spam too."
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: (0,utils.cn)("grid gap-6", className),
        ...props,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("form", {
                onSubmit: handleSubmit(onSubmit),
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "grid gap-2",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: "grid gap-1",
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx(label/* Label */._, {
                                    className: "sr-only",
                                    htmlFor: "email",
                                    children: "Email"
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx(input/* Input */.I, {
                                    id: "email",
                                    placeholder: "name@example.com",
                                    type: "email",
                                    autoCapitalize: "none",
                                    autoComplete: "email",
                                    autoCorrect: "off",
                                    disabled: isLoading || isGitHubLoading,
                                    ...register("email")
                                }),
                                errors?.email && /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                    className: "px-1 text-xs text-red-600",
                                    children: errors.email.message
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("button", {
                            className: (0,utils.cn)((0,ui_button/* buttonVariants */.d)()),
                            disabled: isLoading,
                            children: [
                                isLoading && /*#__PURE__*/ jsx_runtime_.jsx(icons/* Icons.spinner */.P.spinner, {
                                    className: "mr-2 h-4 w-4 animate-spin"
                                }),
                                "Sign In with Email"
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "absolute inset-0 flex items-center",
                        children: /*#__PURE__*/ jsx_runtime_.jsx("span", {
                            className: "w-full border-t"
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "relative flex justify-center text-xs uppercase",
                        children: /*#__PURE__*/ jsx_runtime_.jsx("span", {
                            className: "bg-background px-2 text-muted-foreground",
                            children: "Or continue with"
                        })
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("button", {
                type: "button",
                className: (0,utils.cn)((0,ui_button/* buttonVariants */.d)({
                    variant: "outline"
                })),
                onClick: ()=>{
                    setIsGitHubLoading(true);
                    (0,react.signIn)("github");
                },
                disabled: isLoading || isGitHubLoading,
                children: [
                    isGitHubLoading ? /*#__PURE__*/ jsx_runtime_.jsx(icons/* Icons.spinner */.P.spinner, {
                        className: "mr-2 h-4 w-4 animate-spin"
                    }) : /*#__PURE__*/ jsx_runtime_.jsx(icons/* Icons.gitHub */.P.gitHub, {
                        className: "mr-2 h-4 w-4"
                    }),
                    " ",
                    "Github"
                ]
            })
        ]
    });
}


/***/ }),

/***/ 31263:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AuthLayout)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function AuthLayout({ children  }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "min-h-screen",
        children: children
    });
}


/***/ }),

/***/ 39884:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fJ": () => (/* binding */ e0)
/* harmony export */ });
/* unused harmony exports __esModule, $$typeof */
/* harmony import */ var next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(35985);

const proxy = (0,next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__.createProxy)(String.raw`/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/components/user-auth-form.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (proxy.default);

const e0 = proxy["UserAuthForm"];


/***/ })

};
;