"use strict";
exports.id = 759;
exports.ids = [759];
exports.modules = {

/***/ 73261:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "MainNav": () => (/* binding */ MainNav)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(31621);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(59483);
;// CONCATENATED MODULE: ./config/site.ts
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

// EXTERNAL MODULE: ./lib/utils.ts + 1 modules
var utils = __webpack_require__(60568);
// EXTERNAL MODULE: ./components/icons.tsx
var icons = __webpack_require__(79942);
;// CONCATENATED MODULE: ./hooks/use-lock-body.ts

// @see https://usehooks.com/useLockBodyScroll.
function useLockBody() {
    react_.useLayoutEffect(()=>{
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";
        return ()=>document.body.style.overflow = originalStyle;
    }, []);
}

;// CONCATENATED MODULE: ./components/mobile-nav.tsx







function MobileNav({ items , children  }) {
    useLockBody();
    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: (0,utils.cn)("fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden"),
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
            className: "relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md",
            children: [
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                    href: "/",
                    className: "flex items-center space-x-2",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx(icons/* Icons.logo */.P.logo, {}),
                        /*#__PURE__*/ jsx_runtime_.jsx("span", {
                            className: "font-bold",
                            children: siteConfig.name
                        })
                    ]
                }),
                /*#__PURE__*/ jsx_runtime_.jsx("nav", {
                    className: "grid grid-flow-row auto-rows-max text-sm",
                    children: items.map((item, index)=>/*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                            href: item.disabled ? "#" : item.href,
                            className: (0,utils.cn)("flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline", item.disabled && "cursor-not-allowed opacity-60"),
                            children: item.title
                        }, index))
                }),
                children
            ]
        })
    });
}

;// CONCATENATED MODULE: ./components/main-nav.tsx
/* __next_internal_client_entry_do_not_use__ MainNav auto */ 







function MainNav({ items , children  }) {
    const segment = (0,navigation.useSelectedLayoutSegment)();
    const [showMobileMenu, setShowMobileMenu] = react_.useState(false);
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "flex gap-6 md:gap-10",
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                href: "/",
                className: "hidden items-center space-x-2 md:flex",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(icons/* Icons.logo */.P.logo, {}),
                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                        className: "hidden font-bold sm:inline-block",
                        children: siteConfig.name
                    })
                ]
            }),
            items?.length ? /*#__PURE__*/ jsx_runtime_.jsx("nav", {
                className: "hidden gap-6 md:flex",
                children: items?.map((item, index)=>/*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                        href: item.disabled ? "#" : item.href,
                        className: (0,utils.cn)("flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm", item.href.startsWith(`/${segment}`) ? "text-foreground" : "text-foreground/60", item.disabled && "cursor-not-allowed opacity-80"),
                        children: item.title
                    }, index))
            }) : null,
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("button", {
                className: "flex items-center space-x-2 md:hidden",
                onClick: ()=>setShowMobileMenu(!showMobileMenu),
                children: [
                    showMobileMenu ? /*#__PURE__*/ jsx_runtime_.jsx(icons/* Icons.close */.P.close, {}) : /*#__PURE__*/ jsx_runtime_.jsx(icons/* Icons.logo */.P.logo, {}),
                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                        className: "font-bold",
                        children: "Menu"
                    })
                ]
            }),
            showMobileMenu && items && /*#__PURE__*/ jsx_runtime_.jsx(MobileNav, {
                items: items,
                children: children
            })
        ]
    });
}


/***/ }),

/***/ 91665:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ModeToggle": () => (/* binding */ ModeToggle)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(95176);
/* harmony import */ var _components_ui_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(98302);
/* harmony import */ var _components_ui_dropdown_menu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(31671);
/* harmony import */ var _components_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(79942);
/* __next_internal_client_entry_do_not_use__ ModeToggle auto */ 





function ModeToggle() {
    const { setTheme  } = (0,next_themes__WEBPACK_IMPORTED_MODULE_2__/* .useTheme */ .F)();
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_ui_dropdown_menu__WEBPACK_IMPORTED_MODULE_4__/* .DropdownMenu */ .h_, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ui_dropdown_menu__WEBPACK_IMPORTED_MODULE_4__/* .DropdownMenuTrigger */ .$F, {
                asChild: true,
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_ui_button__WEBPACK_IMPORTED_MODULE_3__/* .Button */ .z, {
                    variant: "ghost",
                    size: "sm",
                    className: "h-8 w-8 px-0",
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_icons__WEBPACK_IMPORTED_MODULE_5__/* .Icons.sun */ .P.sun, {
                            className: "rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_icons__WEBPACK_IMPORTED_MODULE_5__/* .Icons.moon */ .P.moon, {
                            className: "absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                            className: "sr-only",
                            children: "Toggle theme"
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_ui_dropdown_menu__WEBPACK_IMPORTED_MODULE_4__/* .DropdownMenuContent */ .AW, {
                align: "end",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_ui_dropdown_menu__WEBPACK_IMPORTED_MODULE_4__/* .DropdownMenuItem */ .Xi, {
                        onClick: ()=>setTheme("light"),
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_icons__WEBPACK_IMPORTED_MODULE_5__/* .Icons.sun */ .P.sun, {
                                className: "mr-2 h-4 w-4"
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                children: "Light"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_ui_dropdown_menu__WEBPACK_IMPORTED_MODULE_4__/* .DropdownMenuItem */ .Xi, {
                        onClick: ()=>setTheme("dark"),
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_icons__WEBPACK_IMPORTED_MODULE_5__/* .Icons.moon */ .P.moon, {
                                className: "mr-2 h-4 w-4"
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                children: "Dark"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_ui_dropdown_menu__WEBPACK_IMPORTED_MODULE_4__/* .DropdownMenuItem */ .Xi, {
                        onClick: ()=>setTheme("system"),
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_icons__WEBPACK_IMPORTED_MODULE_5__/* .Icons.laptop */ .P.laptop, {
                                className: "mr-2 h-4 w-4"
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                children: "System"
                            })
                        ]
                    })
                ]
            })
        ]
    });
}


/***/ }),

/***/ 31671:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$F": () => (/* binding */ DropdownMenuTrigger),
/* harmony export */   "AW": () => (/* binding */ DropdownMenuContent),
/* harmony export */   "VD": () => (/* binding */ DropdownMenuSeparator),
/* harmony export */   "Xi": () => (/* binding */ DropdownMenuItem),
/* harmony export */   "h_": () => (/* binding */ DropdownMenu)
/* harmony export */ });
/* unused harmony exports DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(38462);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(64660);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(60568);
/* __next_internal_client_entry_do_not_use__ DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem,DropdownMenuCheckboxItem,DropdownMenuRadioItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuShortcut,DropdownMenuGroup,DropdownMenuPortal,DropdownMenuSub,DropdownMenuSubContent,DropdownMenuSubTrigger,DropdownMenuRadioGroup auto */ 




const DropdownMenu = _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .Root */ .fC;
const DropdownMenuTrigger = _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .Trigger */ .xz;
const DropdownMenuGroup = _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .Group */ .ZA;
const DropdownMenuPortal = _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .Portal */ .Uv;
const DropdownMenuSub = _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .Sub */ .Tr;
const DropdownMenuRadioGroup = _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .RadioGroup */ .Ee;
const DropdownMenuSubTrigger = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className , inset , children , ...props }, ref)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .SubTrigger */ .fF, {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent", inset && "pl-8", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* .ChevronRight */ ._Qn, {
                className: "ml-auto h-4 w-4"
            })
        ]
    }));
DropdownMenuSubTrigger.displayName = _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .SubTrigger.displayName */ .fF.displayName;
const DropdownMenuSubContent = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .SubContent */ .tu, {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("text-on-popover z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 shadow-md animate-in data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1", className),
        ...props
    }));
DropdownMenuSubContent.displayName = _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .SubContent.displayName */ .tu.displayName;
const DropdownMenuContent = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className , sideOffset =4 , ...props }, ref)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .Portal */ .Uv, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .Content */ .VY, {
            ref: ref,
            sideOffset: sideOffset,
            className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
            ...props
        })
    }));
DropdownMenuContent.displayName = _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .Content.displayName */ .VY.displayName;
const DropdownMenuItem = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className , inset , ...props }, ref)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .Item */ .ck, {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", inset && "pl-8", className),
        ...props
    }));
DropdownMenuItem.displayName = _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .Item.displayName */ .ck.displayName;
const DropdownMenuCheckboxItem = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className , children , checked , ...props }, ref)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .CheckboxItem */ .oC, {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        checked: checked,
        ...props,
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .ItemIndicator */ .wU, {
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* .Check */ .JrY, {
                        className: "h-4 w-4"
                    })
                })
            }),
            children
        ]
    }));
DropdownMenuCheckboxItem.displayName = _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .CheckboxItem.displayName */ .oC.displayName;
const DropdownMenuRadioItem = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className , children , ...props }, ref)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .RadioItem */ .Rk, {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        ...props,
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .ItemIndicator */ .wU, {
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* .Circle */ .Cdc, {
                        className: "h-2 w-2 fill-current"
                    })
                })
            }),
            children
        ]
    }));
DropdownMenuRadioItem.displayName = _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .RadioItem.displayName */ .Rk.displayName;
const DropdownMenuLabel = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className , inset , ...props }, ref)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .Label */ .__, {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
        ...props
    }));
DropdownMenuLabel.displayName = _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .Label.displayName */ .__.displayName;
const DropdownMenuSeparator = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .Separator */ .Z0, {
        ref: ref,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("-mx-1 my-1 h-px bg-muted", className),
        ...props
    }));
DropdownMenuSeparator.displayName = _radix_ui_react_dropdown_menu__WEBPACK_IMPORTED_MODULE_3__/* .Separator.displayName */ .Z0.displayName;
const DropdownMenuShortcut = ({ className , ...props })=>{
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("ml-auto text-xs tracking-widest opacity-60", className),
        ...props
    });
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";



/***/ }),

/***/ 7742:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$t": () => (/* binding */ e0)
/* harmony export */ });
/* unused harmony exports __esModule, $$typeof */
/* harmony import */ var next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(35985);

const proxy = (0,next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__.createProxy)(String.raw`/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/components/main-nav.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (proxy.default);

const e0 = proxy["MainNav"];


/***/ }),

/***/ 94513:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "n": () => (/* binding */ SiteFooter)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/react.shared-subset.js
var react_shared_subset = __webpack_require__(34212);
// EXTERNAL MODULE: ./config/site.ts
var site = __webpack_require__(7506);
// EXTERNAL MODULE: ./lib/utils.ts
var utils = __webpack_require__(22213);
// EXTERNAL MODULE: ./components/icons.tsx
var icons = __webpack_require__(27603);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(35985);
;// CONCATENATED MODULE: ./components/mode-toggle.tsx

const proxy = (0,module_proxy.createProxy)(String.raw`/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/components/mode-toggle.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
/* harmony default export */ const mode_toggle = (proxy.default);

const e0 = proxy["ModeToggle"];

;// CONCATENATED MODULE: ./components/site-footer.tsx






function SiteFooter({ className  }) {
    return /*#__PURE__*/ jsx_runtime_.jsx("footer", {
        className: (0,utils.cn)(className),
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
            className: "container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0",
            children: [
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx(icons/* Icons.logo */.P.logo, {}),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("p", {
                            className: "text-center text-sm leading-loose md:text-left",
                            children: [
                                "Built by",
                                " ",
                                /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                    href: site/* siteConfig.links.twitter */.J.links.twitter,
                                    target: "_blank",
                                    rel: "noreferrer",
                                    className: "font-medium underline underline-offset-4",
                                    children: "shadcn"
                                }),
                                ". Hosted on",
                                " ",
                                /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                    href: "https://vercel.com",
                                    target: "_blank",
                                    rel: "noreferrer",
                                    className: "font-medium underline underline-offset-4",
                                    children: "Vercel"
                                }),
                                ". Illustrations by",
                                " ",
                                /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                    href: "https://popsy.co",
                                    target: "_blank",
                                    rel: "noreferrer",
                                    className: "font-medium underline underline-offset-4",
                                    children: "Popsy"
                                }),
                                ". The source code is available on",
                                " ",
                                /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                    href: site/* siteConfig.links.github */.J.links.github,
                                    target: "_blank",
                                    rel: "noreferrer",
                                    className: "font-medium underline underline-offset-4",
                                    children: "GitHub"
                                }),
                                "."
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ jsx_runtime_.jsx(e0, {})
            ]
        })
    });
}


/***/ })

};
;