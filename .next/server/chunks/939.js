exports.id = 939;
exports.ids = [939];
exports.modules = {

/***/ 69781:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 89222, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 78301, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 83751, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 54765, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 5192, 23))

/***/ }),

/***/ 7142:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 76358));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 11495));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 56853))

/***/ }),

/***/ 76358:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Analytics": () => (/* binding */ Analytics)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _vercel_analytics_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(39506);
/* __next_internal_client_entry_do_not_use__ Analytics auto */ 

function Analytics() {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_vercel_analytics_react__WEBPACK_IMPORTED_MODULE_1__/* .Analytics */ .c, {});
}


/***/ }),

/***/ 11495:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ThemeProvider": () => (/* binding */ ThemeProvider)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(95176);
/* __next_internal_client_entry_do_not_use__ ThemeProvider auto */ 


function ThemeProvider({ children , ...props }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_themes__WEBPACK_IMPORTED_MODULE_2__/* .ThemeProvider */ .f, {
        ...props,
        children: children
    });
}


/***/ }),

/***/ 56853:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Toaster": () => (/* binding */ Toaster)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-toast/dist/index.mjs + 1 modules
var dist = __webpack_require__(36679);
// EXTERNAL MODULE: ./node_modules/class-variance-authority/dist/index.cjs.js
var index_cjs = __webpack_require__(47157);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/cjs/lucide-react.js
var lucide_react = __webpack_require__(64660);
// EXTERNAL MODULE: ./lib/utils.ts + 1 modules
var utils = __webpack_require__(60568);
;// CONCATENATED MODULE: ./components/ui/toast.tsx






const ToastProvider = dist/* Provider */.zt;
const ToastViewport = /*#__PURE__*/ react_.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Viewport */.l_, {
        ref: ref,
        className: (0,utils.cn)("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className),
        ...props
    }));
ToastViewport.displayName = dist/* Viewport.displayName */.l_.displayName;
const toastVariants = (0,index_cjs/* cva */.j)("data-[swipe=move]:transition-none group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full", {
    variants: {
        variant: {
            default: "bg-background border",
            destructive: "group destructive border-destructive bg-destructive text-destructive-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Toast = /*#__PURE__*/ react_.forwardRef(({ className , variant , ...props }, ref)=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(dist/* Root */.fC, {
        ref: ref,
        className: (0,utils.cn)(toastVariants({
            variant
        }), className),
        ...props
    });
});
Toast.displayName = dist/* Root.displayName */.fC.displayName;
const ToastAction = /*#__PURE__*/ react_.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Action */.aU, {
        ref: ref,
        className: (0,utils.cn)("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-destructive/30 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive", className),
        ...props
    }));
ToastAction.displayName = dist/* Action.displayName */.aU.displayName;
const ToastClose = /*#__PURE__*/ react_.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Close */.x8, {
        ref: ref,
        className: (0,utils.cn)("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600", className),
        "toast-close": "",
        ...props,
        children: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react.X, {
            className: "h-4 w-4"
        })
    }));
ToastClose.displayName = dist/* Close.displayName */.x8.displayName;
const ToastTitle = /*#__PURE__*/ react_.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Title */.Dx, {
        ref: ref,
        className: (0,utils.cn)("text-sm font-semibold", className),
        ...props
    }));
ToastTitle.displayName = dist/* Title.displayName */.Dx.displayName;
const ToastDescription = /*#__PURE__*/ react_.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Description */.dk, {
        ref: ref,
        className: (0,utils.cn)("text-sm opacity-90", className),
        ...props
    }));
ToastDescription.displayName = dist/* Description.displayName */.dk.displayName;


// EXTERNAL MODULE: ./components/ui/use-toast.ts
var use_toast = __webpack_require__(69057);
;// CONCATENATED MODULE: ./components/ui/toaster.tsx
/* __next_internal_client_entry_do_not_use__ Toaster auto */ 


function Toaster() {
    const { toasts  } = (0,use_toast/* useToast */.pm)();
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(ToastProvider, {
        children: [
            toasts.map(function({ id , title , description , action , ...props }) {
                return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(Toast, {
                    ...props,
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: "grid gap-1",
                            children: [
                                title && /*#__PURE__*/ jsx_runtime_.jsx(ToastTitle, {
                                    children: title
                                }),
                                description && /*#__PURE__*/ jsx_runtime_.jsx(ToastDescription, {
                                    children: description
                                })
                            ]
                        }),
                        action,
                        /*#__PURE__*/ jsx_runtime_.jsx(ToastClose, {})
                    ]
                }, id);
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(ToastViewport, {})
        ]
    });
}


/***/ }),

/***/ 69057:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Am": () => (/* binding */ toast),
/* harmony export */   "pm": () => (/* binding */ useToast)
/* harmony export */ });
/* unused harmony export reducer */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
// Inspired by react-hot-toast library

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST"
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_VALUE;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case "DISMISS_TOAST":
            {
                const { toastId  } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: "UPDATE_TOAST",
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: "DISMISS_TOAST",
            toastId: id
        });
    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    const [state, setState] = react__WEBPACK_IMPORTED_MODULE_0__.useState(memoryState);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{
        listeners.push(setState);
        return ()=>{
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: "DISMISS_TOAST",
                toastId
            })
    };
}



/***/ }),

/***/ 60568:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "cn": () => (/* binding */ cn),
  "p": () => (/* binding */ formatDate)
});

// UNUSED EXPORTS: absoluteUrl

// EXTERNAL MODULE: ./node_modules/clsx/dist/clsx.js
var clsx = __webpack_require__(14889);
// EXTERNAL MODULE: ./node_modules/tailwind-merge/dist/lib/tw-merge.mjs + 10 modules
var tw_merge = __webpack_require__(4798);
// EXTERNAL MODULE: ./node_modules/@t3-oss/env-nextjs/dist/index.mjs + 2 modules
var dist = __webpack_require__(97349);
// EXTERNAL MODULE: ./node_modules/zod/v3/types.js + 1 modules
var types = __webpack_require__(81186);
;// CONCATENATED MODULE: ./env.mjs


const env_env = (0,dist/* createEnv */.D)({
    server: {
        // This is optional because it's only used in development.
        // See https://next-auth.js.org/deployment.
        NEXTAUTH_URL: types/* string */.Z_().url().optional(),
        NEXTAUTH_SECRET: types/* string */.Z_().min(1),
        GITHUB_CLIENT_ID: types/* string */.Z_().min(1).optional(),
        GITHUB_CLIENT_SECRET: types/* string */.Z_().min(1).optional(),
        GITHUB_ACCESS_TOKEN: types/* string */.Z_().min(1).optional(),
        DATABASE_URL: types/* string */.Z_().min(1),
        PRISMA_DATABASE_URL: types/* string */.Z_().min(1).optional(),
        SMTP_FROM: types/* string */.Z_().min(1).optional(),
        POSTMARK_API_TOKEN: types/* string */.Z_().min(1).optional(),
        POSTMARK_SIGN_IN_TEMPLATE: types/* string */.Z_().min(1).optional(),
        POSTMARK_ACTIVATION_TEMPLATE: types/* string */.Z_().min(1).optional(),
        STRIPE_API_KEY: types/* string */.Z_().min(1).optional(),
        STRIPE_WEBHOOK_SECRET: types/* string */.Z_().min(1).optional(),
        STRIPE_PRO_MONTHLY_PLAN_ID: types/* string */.Z_().min(1).optional()
    },
    client: {
        NEXT_PUBLIC_APP_URL: types/* string */.Z_().min(1)
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

;// CONCATENATED MODULE: ./lib/utils.ts



function cn(...inputs) {
    return (0,tw_merge/* twMerge */.m)((0,clsx.clsx)(inputs));
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
    return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}


/***/ }),

/***/ 78898:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ RootLayout),
  "metadata": () => (/* binding */ metadata)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"app/layout.tsx","import":"Inter","arguments":[{"subsets":["latin"],"variable":"--font-sans"}],"variableName":"fontSans"}
var layout_tsx_import_Inter_arguments_subsets_latin_variable_font_sans_variableName_fontSans_ = __webpack_require__(34759);
var layout_tsx_import_Inter_arguments_subsets_latin_variable_font_sans_variableName_fontSans_default = /*#__PURE__*/__webpack_require__.n(layout_tsx_import_Inter_arguments_subsets_latin_variable_font_sans_variableName_fontSans_);
// EXTERNAL MODULE: ./node_modules/next/font/local/target.css?{"path":"app/layout.tsx","import":"","arguments":[{"src":"../assets/fonts/CalSans-SemiBold.woff2","variable":"--font-heading"}],"variableName":"fontHeading"}
var CalSans_SemiBold_woff2_variable_font_heading_variableName_fontHeading_ = __webpack_require__(56861);
var CalSans_SemiBold_woff2_variable_font_heading_variableName_fontHeading_default = /*#__PURE__*/__webpack_require__.n(CalSans_SemiBold_woff2_variable_font_heading_variableName_fontHeading_);
// EXTERNAL MODULE: ./styles/globals.css
var globals = __webpack_require__(46495);
// EXTERNAL MODULE: ./config/site.ts
var site = __webpack_require__(7506);
// EXTERNAL MODULE: ./lib/utils.ts
var utils = __webpack_require__(22213);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(35985);
;// CONCATENATED MODULE: ./components/ui/toaster.tsx

const proxy = (0,module_proxy.createProxy)(String.raw`/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/components/ui/toaster.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
/* harmony default export */ const toaster = (proxy.default);

const e0 = proxy["Toaster"];

;// CONCATENATED MODULE: ./components/analytics.tsx

const analytics_proxy = (0,module_proxy.createProxy)(String.raw`/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/components/analytics.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: analytics_esModule, $$typeof: analytics_$$typeof } = analytics_proxy;
/* harmony default export */ const analytics = (analytics_proxy.default);

const analytics_e0 = analytics_proxy["Analytics"];

;// CONCATENATED MODULE: ./components/tailwind-indicator.tsx

function TailwindIndicator() {
    if (true) return null;
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "block sm:hidden",
                children: "xs"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden",
                children: "sm"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "hidden md:block lg:hidden xl:hidden 2xl:hidden",
                children: "md"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "hidden lg:block xl:hidden 2xl:hidden",
                children: "lg"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "hidden xl:block 2xl:hidden",
                children: "xl"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "hidden 2xl:block",
                children: "2xl"
            })
        ]
    });
}

;// CONCATENATED MODULE: ./components/theme-provider.tsx

const theme_provider_proxy = (0,module_proxy.createProxy)(String.raw`/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/components/theme-provider.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: theme_provider_esModule, $$typeof: theme_provider_$$typeof } = theme_provider_proxy;
/* harmony default export */ const theme_provider = (theme_provider_proxy.default);

const theme_provider_e0 = theme_provider_proxy["ThemeProvider"];

;// CONCATENATED MODULE: ./app/layout.tsx










const metadata = {
    title: {
        default: site/* siteConfig.name */.J.name,
        template: `%s | ${site/* siteConfig.name */.J.name}`
    },
    description: site/* siteConfig.description */.J.description,
    keywords: [
        "Next.js",
        "React",
        "Tailwind CSS",
        "Server Components",
        "Radix UI"
    ],
    authors: [
        {
            name: "shadcn",
            url: "https://shadcn.com"
        }
    ],
    creator: "shadcn",
    themeColor: [
        {
            media: "(prefers-color-scheme: light)",
            color: "white"
        },
        {
            media: "(prefers-color-scheme: dark)",
            color: "black"
        }
    ],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: site/* siteConfig.url */.J.url,
        title: site/* siteConfig.name */.J.name,
        description: site/* siteConfig.description */.J.description,
        siteName: site/* siteConfig.name */.J.name
    },
    twitter: {
        card: "summary_large_image",
        title: site/* siteConfig.name */.J.name,
        description: site/* siteConfig.description */.J.description,
        images: [
            `${site/* siteConfig.url */.J.url}/og.jpg`
        ],
        creator: "@shadcn"
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png"
    },
    manifest: `${site/* siteConfig.url */.J.url}/site.webmanifest`
};
function RootLayout({ children  }) {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("html", {
        lang: "en",
        suppressHydrationWarning: true,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("head", {}),
            /*#__PURE__*/ jsx_runtime_.jsx("body", {
                className: (0,utils.cn)("min-h-screen bg-background font-sans antialiased", (layout_tsx_import_Inter_arguments_subsets_latin_variable_font_sans_variableName_fontSans_default()).variable, (CalSans_SemiBold_woff2_variable_font_heading_variableName_fontHeading_default()).variable),
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(theme_provider_e0, {
                    attribute: "class",
                    defaultTheme: "system",
                    enableSystem: true,
                    children: [
                        children,
                        /*#__PURE__*/ jsx_runtime_.jsx(analytics_e0, {}),
                        /*#__PURE__*/ jsx_runtime_.jsx(e0, {}),
                        /*#__PURE__*/ jsx_runtime_.jsx(TailwindIndicator, {})
                    ]
                })
            })
        ]
    });
}


/***/ }),

/***/ 7506:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ 22213:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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


/***/ }),

/***/ 8236:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12548);
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__);
  

  /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((props) => {
    const imageData = {"type":"image/jpeg","width":2400,"height":1260}
    const imageUrl = (0,next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__.fillMetadataSegment)("", props.params, "opengraph-image.jpg")

    return [{
      ...imageData,
      url: imageUrl + "?a25ca70e900445ed",
    }]
  });

/***/ }),

/***/ 46495:
/***/ (() => {



/***/ })

};
;