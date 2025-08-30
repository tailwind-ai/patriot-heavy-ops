"use strict";
exports.id = 853;
exports.ids = [853];
exports.modules = {

/***/ 86853:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "d": () => (/* binding */ buttonVariants)
/* harmony export */ });
/* unused harmony export Button */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(34212);
/* harmony import */ var class_variance_authority__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(33943);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(22213);




const buttonVariants = (0,class_variance_authority__WEBPACK_IMPORTED_MODULE_2__/* .cva */ .j)("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "underline-offset-4 hover:underline text-primary"
        },
        size: {
            default: "h-10 py-2 px-4",
            sm: "h-9 px-3 rounded-md",
            lg: "h-11 px-8 rounded-md"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className , variant , size , ...props }, ref)=>{
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    });
});
Button.displayName = "Button";



/***/ })

};
;