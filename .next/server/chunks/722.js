"use strict";
exports.id = 722;
exports.ids = [722];
exports.modules = {

/***/ 41308:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ol": () => (/* binding */ CardHeader),
/* harmony export */   "SZ": () => (/* binding */ CardDescription),
/* harmony export */   "Zb": () => (/* binding */ Card),
/* harmony export */   "aY": () => (/* binding */ CardContent),
/* harmony export */   "eW": () => (/* binding */ CardFooter),
/* harmony export */   "ll": () => (/* binding */ CardTitle)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(60568);



const Card = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("rounded-lg border bg-card text-card-foreground shadow-sm", className),
        ...props
    }));
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("flex flex-col space-y-1.5 p-6", className),
        ...props
    }));
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("text-lg font-semibold leading-none tracking-tight", className),
        ...props
    }));
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("text-sm text-muted-foreground", className),
        ...props
    }));
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("p-6 pt-0", className),
        ...props
    }));
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)(" flex items-center p-6 pt-0", className),
        ...props
    }));
CardFooter.displayName = "CardFooter";



/***/ }),

/***/ 75280:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "q": () => (/* binding */ CardSkeleton)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/react.shared-subset.js
var react_shared_subset = __webpack_require__(34212);
// EXTERNAL MODULE: ./lib/utils.ts
var utils = __webpack_require__(22213);
;// CONCATENATED MODULE: ./components/ui/card.tsx



const Card = /*#__PURE__*/ react_shared_subset.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
        ref: ref,
        className: (0,utils.cn)("rounded-lg border bg-card text-card-foreground shadow-sm", className),
        ...props
    }));
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ react_shared_subset.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
        ref: ref,
        className: (0,utils.cn)("flex flex-col space-y-1.5 p-6", className),
        ...props
    }));
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ react_shared_subset.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx("h3", {
        ref: ref,
        className: (0,utils.cn)("text-lg font-semibold leading-none tracking-tight", className),
        ...props
    }));
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ react_shared_subset.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx("p", {
        ref: ref,
        className: (0,utils.cn)("text-sm text-muted-foreground", className),
        ...props
    }));
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ react_shared_subset.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
        ref: ref,
        className: (0,utils.cn)("p-6 pt-0", className),
        ...props
    }));
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ react_shared_subset.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
        ref: ref,
        className: (0,utils.cn)(" flex items-center p-6 pt-0", className),
        ...props
    }));
CardFooter.displayName = "CardFooter";


// EXTERNAL MODULE: ./components/ui/skeleton.tsx
var skeleton = __webpack_require__(9996);
;// CONCATENATED MODULE: ./components/card-skeleton.tsx



function CardSkeleton() {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(Card, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)(CardHeader, {
                className: "gap-2",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(skeleton/* Skeleton */.O, {
                        className: "h-5 w-1/5"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(skeleton/* Skeleton */.O, {
                        className: "h-4 w-4/5"
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(CardContent, {
                className: "h-10"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(CardFooter, {
                children: /*#__PURE__*/ jsx_runtime_.jsx(skeleton/* Skeleton */.O, {
                    className: "h-8 w-[120px]"
                })
            })
        ]
    });
}


/***/ })

};
;