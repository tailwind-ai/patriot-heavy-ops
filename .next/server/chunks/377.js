exports.id = 377;
exports.ids = [377];
exports.modules = {

/***/ 11408:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 45296));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 20053, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 68975))

/***/ }),

/***/ 7844:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 3280, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 69274, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 3349, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 92144, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 73261));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 91665));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 30363));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 66472))

/***/ }),

/***/ 30363:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DashboardNav": () => (/* binding */ DashboardNav)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(31621);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(59483);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(60568);
/* harmony import */ var _components_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(79942);
/* __next_internal_client_entry_do_not_use__ DashboardNav auto */ 




function DashboardNav({ items  }) {
    const path = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.usePathname)();
    if (!items?.length) {
        return null;
    }
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("nav", {
        className: "grid items-start gap-2",
        children: items.map((item, index)=>{
            const Icon = _components_icons__WEBPACK_IMPORTED_MODULE_4__/* .Icons */ .P[item.icon || "arrowRight"];
            return item.href && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
                href: item.disabled ? "/" : item.href,
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)("group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground", path === item.href ? "bg-accent" : "transparent", item.disabled && "cursor-not-allowed opacity-80"),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Icon, {
                            className: "mr-2 h-4 w-4"
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                            children: item.title
                        })
                    ]
                })
            }, index);
        })
    });
}


/***/ }),

/***/ 45296:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PostCreateButton": () => (/* binding */ PostCreateButton)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(59483);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(60568);
/* harmony import */ var _components_ui_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(98302);
/* harmony import */ var _components_ui_use_toast__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(69057);
/* harmony import */ var _components_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(79942);
/* __next_internal_client_entry_do_not_use__ PostCreateButton auto */ 






function PostCreateButton({ className , variant , ...props }) {
    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    const [isLoading, setIsLoading] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
    async function onClick() {
        setIsLoading(true);
        const response = await fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "Untitled Post"
            })
        });
        setIsLoading(false);
        if (!response?.ok) {
            if (response.status === 402) {
                return (0,_components_ui_use_toast__WEBPACK_IMPORTED_MODULE_5__/* .toast */ .Am)({
                    title: "Limit of 3 posts reached.",
                    description: "Please upgrade to the PRO plan.",
                    variant: "destructive"
                });
            }
            return (0,_components_ui_use_toast__WEBPACK_IMPORTED_MODULE_5__/* .toast */ .Am)({
                title: "Something went wrong.",
                description: "Your post was not created. Please try again.",
                variant: "destructive"
            });
        }
        const post = await response.json();
        // This forces a cache invalidation.
        router.refresh();
        router.push(`/editor/${post.id}`);
    }
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
        onClick: onClick,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)((0,_components_ui_button__WEBPACK_IMPORTED_MODULE_4__/* .buttonVariants */ .d)({
            variant
        }), {
            "cursor-not-allowed opacity-60": isLoading
        }, className),
        disabled: isLoading,
        ...props,
        children: [
            isLoading ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_icons__WEBPACK_IMPORTED_MODULE_6__/* .Icons.spinner */ .P.spinner, {
                className: "mr-2 h-4 w-4 animate-spin"
            }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_icons__WEBPACK_IMPORTED_MODULE_6__/* .Icons.add */ .P.add, {
                className: "mr-2 h-4 w-4"
            }),
            "New post"
        ]
    });
}


/***/ }),

/***/ 68975:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "PostOperations": () => (/* binding */ PostOperations)
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
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-alert-dialog/dist/index.mjs + 1 modules
var dist = __webpack_require__(69014);
// EXTERNAL MODULE: ./lib/utils.ts + 1 modules
var utils = __webpack_require__(60568);
// EXTERNAL MODULE: ./components/ui/button.tsx
var ui_button = __webpack_require__(98302);
;// CONCATENATED MODULE: ./components/ui/alert-dialog.tsx
/* __next_internal_client_entry_do_not_use__ AlertDialog,AlertDialogTrigger,AlertDialogContent,AlertDialogHeader,AlertDialogFooter,AlertDialogTitle,AlertDialogDescription,AlertDialogAction,AlertDialogCancel auto */ 




const AlertDialog = dist/* Root */.fC;
const AlertDialogTrigger = dist/* Trigger */.xz;
const AlertDialogPortal = ({ children , ...props })=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Portal */.h_, {
        ...props,
        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
            className: "fixed inset-0 z-50 flex items-end justify-center sm:items-center",
            children: children
        })
    });
AlertDialogPortal.displayName = dist/* Portal.displayName */.h_.displayName;
const AlertDialogOverlay = /*#__PURE__*/ react_.forwardRef(({ className , children , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Overlay */.aV, {
        className: (0,utils.cn)("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in", className),
        ...props,
        ref: ref
    }));
AlertDialogOverlay.displayName = dist/* Overlay.displayName */.aV.displayName;
const AlertDialogContent = /*#__PURE__*/ react_.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)(AlertDialogPortal, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(AlertDialogOverlay, {}),
            /*#__PURE__*/ jsx_runtime_.jsx(dist/* Content */.VY, {
                ref: ref,
                className: (0,utils.cn)("fixed z-50 grid w-full max-w-lg scale-100 gap-4 border bg-background p-6 opacity-100 shadow-lg animate-in fade-in-90 slide-in-from-bottom-10 sm:rounded-lg sm:zoom-in-90 sm:slide-in-from-bottom-0 md:w-full", className),
                ...props
            })
        ]
    }));
AlertDialogContent.displayName = dist/* Content.displayName */.VY.displayName;
const AlertDialogHeader = ({ className , ...props })=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: (0,utils.cn)("flex flex-col space-y-2 text-center sm:text-left", className),
        ...props
    });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className , ...props })=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: (0,utils.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    });
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = /*#__PURE__*/ react_.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Title */.Dx, {
        ref: ref,
        className: (0,utils.cn)("text-lg font-semibold", className),
        ...props
    }));
AlertDialogTitle.displayName = dist/* Title.displayName */.Dx.displayName;
const AlertDialogDescription = /*#__PURE__*/ react_.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Description */.dk, {
        ref: ref,
        className: (0,utils.cn)("text-sm text-muted-foreground", className),
        ...props
    }));
AlertDialogDescription.displayName = dist/* Description.displayName */.dk.displayName;
const AlertDialogAction = /*#__PURE__*/ react_.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Action */.aU, {
        ref: ref,
        className: (0,utils.cn)((0,ui_button/* buttonVariants */.d)(), className),
        ...props
    }));
AlertDialogAction.displayName = dist/* Action.displayName */.aU.displayName;
const AlertDialogCancel = /*#__PURE__*/ react_.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Cancel */.$j, {
        ref: ref,
        className: (0,utils.cn)((0,ui_button/* buttonVariants */.d)({
            variant: "outline"
        }), "mt-2 sm:mt-0", className),
        ...props
    }));
AlertDialogCancel.displayName = dist/* Cancel.displayName */.$j.displayName;


// EXTERNAL MODULE: ./components/ui/dropdown-menu.tsx
var dropdown_menu = __webpack_require__(31671);
// EXTERNAL MODULE: ./components/ui/use-toast.ts
var use_toast = __webpack_require__(69057);
// EXTERNAL MODULE: ./components/icons.tsx
var icons = __webpack_require__(79942);
;// CONCATENATED MODULE: ./components/post-operations.tsx
/* __next_internal_client_entry_do_not_use__ PostOperations auto */ 







async function deletePost(postId) {
    const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE"
    });
    if (!response?.ok) {
        (0,use_toast/* toast */.Am)({
            title: "Something went wrong.",
            description: "Your post was not deleted. Please try again.",
            variant: "destructive"
        });
    }
    return true;
}
function PostOperations({ post  }) {
    const router = (0,navigation.useRouter)();
    const [showDeleteAlert, setShowDeleteAlert] = react_.useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = react_.useState(false);
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)(dropdown_menu/* DropdownMenu */.h_, {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)(dropdown_menu/* DropdownMenuTrigger */.$F, {
                        className: "flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(icons/* Icons.ellipsis */.P.ellipsis, {
                                className: "h-4 w-4"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                className: "sr-only",
                                children: "Open"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)(dropdown_menu/* DropdownMenuContent */.AW, {
                        align: "end",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(dropdown_menu/* DropdownMenuItem */.Xi, {
                                children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                    href: `/editor/${post.id}`,
                                    className: "flex w-full",
                                    children: "Edit"
                                })
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx(dropdown_menu/* DropdownMenuSeparator */.VD, {}),
                            /*#__PURE__*/ jsx_runtime_.jsx(dropdown_menu/* DropdownMenuItem */.Xi, {
                                className: "flex cursor-pointer items-center text-destructive focus:text-destructive",
                                onSelect: ()=>setShowDeleteAlert(true),
                                children: "Delete"
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(AlertDialog, {
                open: showDeleteAlert,
                onOpenChange: setShowDeleteAlert,
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(AlertDialogContent, {
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)(AlertDialogHeader, {
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx(AlertDialogTitle, {
                                    children: "Are you sure you want to delete this post?"
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx(AlertDialogDescription, {
                                    children: "This action cannot be undone."
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)(AlertDialogFooter, {
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx(AlertDialogCancel, {
                                    children: "Cancel"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)(AlertDialogAction, {
                                    onClick: async (event)=>{
                                        event.preventDefault();
                                        setIsDeleteLoading(true);
                                        const deleted = await deletePost(post.id);
                                        if (deleted) {
                                            setIsDeleteLoading(false);
                                            setShowDeleteAlert(false);
                                            router.refresh();
                                        }
                                    },
                                    className: "bg-red-600 focus:ring-red-600",
                                    children: [
                                        isDeleteLoading ? /*#__PURE__*/ jsx_runtime_.jsx(icons/* Icons.spinner */.P.spinner, {
                                            className: "mr-2 h-4 w-4 animate-spin"
                                        }) : /*#__PURE__*/ jsx_runtime_.jsx(icons/* Icons.trash */.P.trash, {
                                            className: "mr-2 h-4 w-4"
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                            children: "Delete"
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            })
        ]
    });
}


/***/ }),

/***/ 66472:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "UserAccountNav": () => (/* binding */ UserAccountNav)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(31621);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/next-auth/react/index.js
var react = __webpack_require__(63370);
// EXTERNAL MODULE: ./components/ui/dropdown-menu.tsx
var dropdown_menu = __webpack_require__(31671);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-avatar/dist/index.mjs + 1 modules
var dist = __webpack_require__(79622);
// EXTERNAL MODULE: ./lib/utils.ts + 1 modules
var utils = __webpack_require__(60568);
;// CONCATENATED MODULE: ./components/ui/avatar.tsx
/* __next_internal_client_entry_do_not_use__ Avatar,AvatarImage,AvatarFallback auto */ 



const Avatar = /*#__PURE__*/ react_.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Root */.fC, {
        ref: ref,
        className: (0,utils.cn)("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
        ...props
    }));
Avatar.displayName = dist/* Root.displayName */.fC.displayName;
const AvatarImage = /*#__PURE__*/ react_.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Image */.Ee, {
        ref: ref,
        className: (0,utils.cn)("aspect-square h-full w-full", className),
        ...props
    }));
AvatarImage.displayName = dist/* Image.displayName */.Ee.displayName;
const AvatarFallback = /*#__PURE__*/ react_.forwardRef(({ className , ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Fallback */.NY, {
        ref: ref,
        className: (0,utils.cn)("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
        ...props
    }));
AvatarFallback.displayName = dist/* Fallback.displayName */.NY.displayName;


// EXTERNAL MODULE: ./components/icons.tsx
var icons = __webpack_require__(79942);
;// CONCATENATED MODULE: ./components/user-avatar.tsx



function UserAvatar({ user , ...props }) {
    return /*#__PURE__*/ jsx_runtime_.jsx(Avatar, {
        ...props,
        children: user.image ? /*#__PURE__*/ jsx_runtime_.jsx(AvatarImage, {
            alt: "Picture",
            src: user.image
        }) : /*#__PURE__*/ (0,jsx_runtime_.jsxs)(AvatarFallback, {
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx("span", {
                    className: "sr-only",
                    children: user.name
                }),
                /*#__PURE__*/ jsx_runtime_.jsx(icons/* Icons.user */.P.user, {
                    className: "h-4 w-4"
                })
            ]
        })
    });
}

;// CONCATENATED MODULE: ./components/user-account-nav.tsx
/* __next_internal_client_entry_do_not_use__ UserAccountNav auto */ 




function UserAccountNav({ user  }) {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(dropdown_menu/* DropdownMenu */.h_, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(dropdown_menu/* DropdownMenuTrigger */.$F, {
                children: /*#__PURE__*/ jsx_runtime_.jsx(UserAvatar, {
                    user: {
                        name: user.name || null,
                        image: user.image || null
                    },
                    className: "h-8 w-8"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)(dropdown_menu/* DropdownMenuContent */.AW, {
                align: "end",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "flex items-center justify-start gap-2 p-2",
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: "flex flex-col space-y-1 leading-none",
                            children: [
                                user.name && /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                    className: "font-medium",
                                    children: user.name
                                }),
                                user.email && /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                    className: "w-[200px] truncate text-sm text-muted-foreground",
                                    children: user.email
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(dropdown_menu/* DropdownMenuSeparator */.VD, {}),
                    /*#__PURE__*/ jsx_runtime_.jsx(dropdown_menu/* DropdownMenuItem */.Xi, {
                        asChild: true,
                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                            href: "/dashboard",
                            children: "Dashboard"
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(dropdown_menu/* DropdownMenuItem */.Xi, {
                        asChild: true,
                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                            href: "/dashboard/billing",
                            children: "Billing"
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(dropdown_menu/* DropdownMenuItem */.Xi, {
                        asChild: true,
                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                            href: "/dashboard/settings",
                            children: "Settings"
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(dropdown_menu/* DropdownMenuSeparator */.VD, {}),
                    /*#__PURE__*/ jsx_runtime_.jsx(dropdown_menu/* DropdownMenuItem */.Xi, {
                        className: "cursor-pointer",
                        onSelect: (event)=>{
                            event.preventDefault();
                            (0,react.signOut)({
                                callbackUrl: `${window.location.origin}/login`
                            });
                        },
                        children: "Sign out"
                    })
                ]
            })
        ]
    });
}


/***/ }),

/***/ 16977:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ DashboardLayout)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(80117);
;// CONCATENATED MODULE: ./config/dashboard.ts
const dashboardConfig = {
    mainNav: [
        {
            title: "Documentation",
            href: "/docs"
        },
        {
            title: "Support",
            href: "/support",
            disabled: true
        }
    ],
    sidebarNav: [
        {
            title: "Posts",
            href: "/dashboard",
            icon: "post"
        },
        {
            title: "Billing",
            href: "/dashboard/billing",
            icon: "billing"
        },
        {
            title: "Settings",
            href: "/dashboard/settings",
            icon: "settings"
        }
    ]
};

// EXTERNAL MODULE: ./lib/session.ts
var session = __webpack_require__(6722);
// EXTERNAL MODULE: ./components/main-nav.tsx
var main_nav = __webpack_require__(7742);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(35985);
;// CONCATENATED MODULE: ./components/nav.tsx

const proxy = (0,module_proxy.createProxy)(String.raw`/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/components/nav.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
/* harmony default export */ const nav = (proxy.default);

const e0 = proxy["DashboardNav"];

// EXTERNAL MODULE: ./components/site-footer.tsx + 1 modules
var site_footer = __webpack_require__(94513);
;// CONCATENATED MODULE: ./components/user-account-nav.tsx

const user_account_nav_proxy = (0,module_proxy.createProxy)(String.raw`/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/components/user-account-nav.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: user_account_nav_esModule, $$typeof: user_account_nav_$$typeof } = user_account_nav_proxy;
/* harmony default export */ const user_account_nav = (user_account_nav_proxy.default);

const user_account_nav_e0 = user_account_nav_proxy["UserAccountNav"];

;// CONCATENATED MODULE: ./app/(dashboard)/dashboard/layout.tsx








async function DashboardLayout({ children  }) {
    const user = await (0,session/* getCurrentUser */.t)();
    if (!user) {
        return (0,navigation.notFound)();
    }
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "flex min-h-screen flex-col space-y-6",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("header", {
                className: "sticky top-0 z-40 border-b bg-background",
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "container flex h-16 items-center justify-between py-4",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx(main_nav/* MainNav */.$t, {
                            items: dashboardConfig.mainNav
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx(user_account_nav_e0, {
                            user: {
                                name: user.name,
                                image: user.image,
                                email: user.email
                            }
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "container grid flex-1 gap-12 md:grid-cols-[200px_1fr]",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("aside", {
                        className: "hidden w-[200px] flex-col md:flex",
                        children: /*#__PURE__*/ jsx_runtime_.jsx(e0, {
                            items: dashboardConfig.sidebarNav
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("main", {
                        className: "flex w-full flex-1 flex-col overflow-hidden",
                        children: children
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(site_footer/* SiteFooter */.n, {
                className: "border-t"
            })
        ]
    });
}


/***/ }),

/***/ 34488:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DashboardLoading)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_header__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85366);
/* harmony import */ var _components_post_create_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(29587);
/* harmony import */ var _components_post_item__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(40159);
/* harmony import */ var _components_shell__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(42722);





function DashboardLoading() {
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_shell__WEBPACK_IMPORTED_MODULE_4__/* .DashboardShell */ .r, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_header__WEBPACK_IMPORTED_MODULE_1__/* .DashboardHeader */ .x, {
                heading: "Posts",
                text: "Create and manage posts.",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_post_create_button__WEBPACK_IMPORTED_MODULE_2__/* .PostCreateButton */ .A3, {})
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "divide-border-200 divide-y rounded-md border",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_post_item__WEBPACK_IMPORTED_MODULE_3__/* .PostItem.Skeleton */ .Y.Skeleton, {}),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_post_item__WEBPACK_IMPORTED_MODULE_3__/* .PostItem.Skeleton */ .Y.Skeleton, {}),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_post_item__WEBPACK_IMPORTED_MODULE_3__/* .PostItem.Skeleton */ .Y.Skeleton, {}),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_post_item__WEBPACK_IMPORTED_MODULE_3__/* .PostItem.Skeleton */ .Y.Skeleton, {}),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_post_item__WEBPACK_IMPORTED_MODULE_3__/* .PostItem.Skeleton */ .Y.Skeleton, {})
                ]
            })
        ]
    });
}


/***/ }),

/***/ 85366:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "x": () => (/* binding */ DashboardHeader)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function DashboardHeader({ heading , text , children  }) {
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "flex items-center justify-between px-2",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "grid gap-1",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                        className: "font-heading text-3xl md:text-4xl",
                        children: heading
                    }),
                    text && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                        className: "text-lg text-muted-foreground",
                        children: text
                    })
                ]
            }),
            children
        ]
    });
}


/***/ }),

/***/ 29587:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A3": () => (/* binding */ e0)
/* harmony export */ });
/* unused harmony exports __esModule, $$typeof */
/* harmony import */ var next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(35985);

const proxy = (0,next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__.createProxy)(String.raw`/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/components/post-create-button.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (proxy.default);

const e0 = proxy["PostCreateButton"];


/***/ }),

/***/ 40159:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Y": () => (/* binding */ PostItem)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(42585);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./lib/utils.ts
var utils = __webpack_require__(22213);
// EXTERNAL MODULE: ./components/ui/skeleton.tsx
var skeleton = __webpack_require__(9996);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(35985);
;// CONCATENATED MODULE: ./components/post-operations.tsx

const proxy = (0,module_proxy.createProxy)(String.raw`/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/components/post-operations.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
/* harmony default export */ const post_operations = (proxy.default);

const e0 = proxy["PostOperations"];

;// CONCATENATED MODULE: ./components/post-item.tsx





function PostItem({ post  }) {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "flex items-center justify-between p-4",
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "grid gap-1",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                        href: `/editor/${post.id}`,
                        className: "font-semibold hover:underline",
                        children: post.title
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        children: /*#__PURE__*/ jsx_runtime_.jsx("p", {
                            className: "text-sm text-muted-foreground",
                            children: (0,utils/* formatDate */.p)(post.createdAt?.toDateString())
                        })
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(e0, {
                post: {
                    id: post.id,
                    title: post.title
                }
            })
        ]
    });
}
PostItem.Skeleton = function PostItemSkeleton() {
    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: "p-4",
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
            className: "space-y-3",
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx(skeleton/* Skeleton */.O, {
                    className: "h-5 w-2/5"
                }),
                /*#__PURE__*/ jsx_runtime_.jsx(skeleton/* Skeleton */.O, {
                    className: "h-4 w-4/5"
                })
            ]
        })
    });
};


/***/ }),

/***/ 42722:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "r": () => (/* binding */ DashboardShell)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(34212);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(22213);



function DashboardShell({ children , className , ...props }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("grid items-start gap-8", className),
        ...props,
        children: children
    });
}


/***/ }),

/***/ 9996:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "O": () => (/* binding */ Skeleton)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(22213);


function Skeleton({ className , ...props }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_1__.cn)("animate-pulse rounded-md bg-muted", className),
        ...props
    });
}



/***/ }),

/***/ 6722:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "t": () => (/* binding */ getCurrentUser)
/* harmony export */ });
/* harmony import */ var next_auth_next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(91071);
/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53439);


async function getCurrentUser() {
    const session = await (0,next_auth_next__WEBPACK_IMPORTED_MODULE_0__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_1__/* .authOptions */ .L);
    return session?.user;
}


/***/ })

};
;