exports.id = 794;
exports.ids = [794];
exports.modules = {

/***/ 47157:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.j = __webpack_unused_export__ = void 0;
const falsyToString = (value)=>typeof value === "boolean" ? "".concat(value) : value === 0 ? "0" : value;
const cx = function() // @ts-ignore
{
    for(var _len = arguments.length, classes = new Array(_len), _key = 0; _key < _len; _key++){
        classes[_key] = arguments[_key];
    }
    return classes.flat(Infinity).filter(Boolean).join(" ");
};
__webpack_unused_export__ = cx;
const cva = (base, config)=>{
    return (props)=>{
        var ref;
        if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
        const { variants , defaultVariants  } = config;
        const getVariantClassNames = Object.keys(variants).map((variant)=>{
            const variantProp = props === null || props === void 0 ? void 0 : props[variant];
            const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
            if (variantProp === null) return null;
            const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
            return variants[variant][variantKey];
        });
        const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param)=>{
            let [key, value] = param;
            if (value === undefined) {
                return acc;
            }
            acc[key] = value;
            return acc;
        }, {});
        const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (ref = config.compoundVariants) === null || ref === void 0 ? void 0 : ref.reduce((acc, param1)=>{
            let { class: cvClass , className: cvClassName , ...compoundVariantOptions } = param1;
            return Object.entries(compoundVariantOptions).every((param)=>{
                let [key, value] = param;
                return Array.isArray(value) ? value.includes({
                    ...defaultVariants,
                    ...propsWithoutUndefined
                }[key]) : ({
                    ...defaultVariants,
                    ...propsWithoutUndefined
                })[key] === value;
            }) ? [
                ...acc,
                cvClass,
                cvClassName
            ] : acc;
        }, []);
        return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
    };
};
exports.j = cva;


//# sourceMappingURL=index.cjs.js.map

/***/ }),

/***/ 14889:
/***/ ((module) => {

function e(r){var o,t,f="";if("string"==typeof r||"number"==typeof r)f+=r;else if("object"==typeof r)if(Array.isArray(r))for(o=0;o<r.length;o++)r[o]&&(t=e(r[o]))&&(f&&(f+=" "),f+=t);else for(o in r)r[o]&&(f&&(f+=" "),f+=o);return f}function r(){for(var r,o,t=0,f="";t<arguments.length;)(r=arguments[t++])&&(o=e(r))&&(f&&(f+=" "),f+=o);return f}module.exports=r,module.exports.clsx=r;

/***/ }),

/***/ 64660:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/**
 * lucide-react v0.92.0 - ISC
 */



__webpack_unused_export__ = ({ value: true });

var react = __webpack_require__(18038);
var PropTypes = __webpack_require__(69232);

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var defaultAttributes = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

var _excluded = ["color", "size", "strokeWidth", "children"];
/**
 * Converts string to KebabCase
 * Copied from scripts/helper. If anyone knows how to properly import it here
 * then please fix it.
 *
 * @param {string} string
 * @returns {string} A kebabized string
 */

var toKebabCase = function toKebabCase(string) {
  return string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};
var createReactComponent = (function (iconName, iconNode) {
  var Component = react.forwardRef(function (_ref, ref) {
    var _ref$color = _ref.color,
        color = _ref$color === void 0 ? 'currentColor' : _ref$color,
        _ref$size = _ref.size,
        size = _ref$size === void 0 ? 24 : _ref$size,
        _ref$strokeWidth = _ref.strokeWidth,
        strokeWidth = _ref$strokeWidth === void 0 ? 2 : _ref$strokeWidth,
        children = _ref.children,
        rest = _objectWithoutPropertiesLoose(_ref, _excluded);

    return react.createElement('svg', _extends({
      ref: ref
    }, defaultAttributes, {
      width: size,
      height: size,
      stroke: color,
      strokeWidth: strokeWidth,
      className: "lucide lucide-" + toKebabCase(iconName)
    }, rest), [].concat(iconNode.map(function (_ref2) {
      var tag = _ref2[0],
          attrs = _ref2[1];
      return react.createElement(tag, attrs);
    }), children || []));
  });
  Component.propTypes = {
    color: PropTypes__default["default"].string,
    size: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].number]),
    strokeWidth: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].number])
  };
  Component.displayName = "" + iconName;
  return Component;
});

var Accessibility = createReactComponent('Accessibility', [['circle', {
  cx: '16',
  cy: '4',
  r: '1',
  key: '1grugj'
}], ['path', {
  d: 'm18 19 1-7-5.87.94',
  key: '16gztd'
}], ['path', {
  d: 'm5 8 3-3 5.5 3-2.21 3.1',
  key: '133gd0'
}], ['path', {
  d: 'M4.24 14.48c-.19.58-.27 1.2-.23 1.84a5 5 0 0 0 5.31 4.67c.65-.04 1.25-.2 1.8-.46',
  key: '12oo9p'
}], ['path', {
  d: 'M13.76 17.52c.19-.58.27-1.2.23-1.84a5 5 0 0 0-5.31-4.67c-.65.04-1.25.2-1.8.46',
  key: '15si8q'
}]]);
var Accessibility$1 = Accessibility;

var Activity = createReactComponent('Activity', [['polyline', {
  points: '22 12 18 12 15 21 9 3 6 12 2 12',
  key: 'xez52g'
}]]);
var Activity$1 = Activity;

var AirVent = createReactComponent('AirVent', [['path', {
  d: 'M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2',
  key: 'larmp2'
}], ['path', {
  d: 'M6 8h12',
  key: '6g4wlu'
}], ['path', {
  d: 'M18.3 17.7a2.5 2.5 0 0 1-3.16 3.83 2.53 2.53 0 0 1-1.14-2V12',
  key: '1bo8pg'
}], ['path', {
  d: 'M6.6 15.6A2 2 0 1 0 10 17v-5',
  key: 't9h90c'
}]]);
var AirVent$1 = AirVent;

var Airplay = createReactComponent('Airplay', [['path', {
  d: 'M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1',
  key: 'ns4c3b'
}], ['polygon', {
  points: '12 15 17 21 7 21 12 15',
  key: '1sy95i'
}]]);
var Airplay$1 = Airplay;

var AlarmCheck = createReactComponent('AlarmCheck', [['path', {
  d: 'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  key: '1dr9l2'
}], ['path', {
  d: 'M5 3 2 6',
  key: '18tl5t'
}], ['path', {
  d: 'm22 6-3-3',
  key: '1opdir'
}], ['path', {
  d: 'm6 19-2 2',
  key: '1ek6nb'
}], ['path', {
  d: 'm18 19 2 2',
  key: 'lw9i'
}], ['path', {
  d: 'm9 13 2 2 4-4',
  key: '6343dt'
}]]);
var AlarmCheck$1 = AlarmCheck;

var AlarmClockOff = createReactComponent('AlarmClockOff', [['path', {
  d: 'M6.87 6.87a8 8 0 1 0 11.26 11.26',
  key: '3on8tj'
}], ['path', {
  d: 'M19.9 14.25A7.44 7.44 0 0 0 20 13a8 8 0 0 0-8-8 7.44 7.44 0 0 0-1.25.1',
  key: 'nxzvge'
}], ['path', {
  d: 'm22 6-3-3',
  key: '1opdir'
}], ['path', {
  d: 'm6 19-2 2',
  key: '1ek6nb'
}], ['path', {
  d: 'm2 2 20 20',
  key: '1ooewy'
}], ['path', {
  d: 'M4 4 2 6',
  key: '1ycko6'
}]]);
var AlarmClockOff$1 = AlarmClockOff;

var AlarmClock = createReactComponent('AlarmClock', [['circle', {
  cx: '12',
  cy: '13',
  r: '8',
  key: '3y4lt7'
}], ['path', {
  d: 'M12 9v4l2 2',
  key: '1c63tq'
}], ['path', {
  d: 'M5 3 2 6',
  key: '18tl5t'
}], ['path', {
  d: 'm22 6-3-3',
  key: '1opdir'
}], ['path', {
  d: 'm6 19-2 2',
  key: '1ek6nb'
}], ['path', {
  d: 'm18 19 2 2',
  key: 'lw9i'
}]]);
var AlarmClock$1 = AlarmClock;

var AlarmMinus = createReactComponent('AlarmMinus', [['path', {
  d: 'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  key: '1dr9l2'
}], ['path', {
  d: 'M5 3 2 6',
  key: '18tl5t'
}], ['path', {
  d: 'm22 6-3-3',
  key: '1opdir'
}], ['path', {
  d: 'm6 19-2 2',
  key: '1ek6nb'
}], ['path', {
  d: 'm18 19 2 2',
  key: 'lw9i'
}], ['path', {
  d: 'M9 13h6',
  key: '1uhe8q'
}]]);
var AlarmMinus$1 = AlarmMinus;

var AlarmPlus = createReactComponent('AlarmPlus', [['path', {
  d: 'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  key: '1dr9l2'
}], ['path', {
  d: 'M5 3 2 6',
  key: '18tl5t'
}], ['path', {
  d: 'm22 6-3-3',
  key: '1opdir'
}], ['path', {
  d: 'm6 19-2 2',
  key: '1ek6nb'
}], ['path', {
  d: 'm18 19 2 2',
  key: 'lw9i'
}], ['path', {
  d: 'M12 10v6',
  key: '1bos4e'
}], ['path', {
  d: 'M9 13h6',
  key: '1uhe8q'
}]]);
var AlarmPlus$1 = AlarmPlus;

var Album = createReactComponent('Album', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['polyline', {
  points: '11 3 11 11 14 8 17 11 17 3',
  key: '1wcwz3'
}]]);
var Album$1 = Album;

var AlertCircle = createReactComponent('AlertCircle', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['line', {
  x1: '12',
  y1: '8',
  x2: '12',
  y2: '12',
  key: '1grbh0'
}], ['line', {
  x1: '12',
  y1: '16',
  x2: '12.01',
  y2: '16',
  key: '1w440g'
}]]);
var AlertCircle$1 = AlertCircle;

var AlertOctagon = createReactComponent('AlertOctagon', [['polygon', {
  points: '7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2',
  key: 'h1p8hx'
}], ['line', {
  x1: '12',
  y1: '8',
  x2: '12',
  y2: '12',
  key: '1grbh0'
}], ['line', {
  x1: '12',
  y1: '16',
  x2: '12.01',
  y2: '16',
  key: '1w440g'
}]]);
var AlertOctagon$1 = AlertOctagon;

var AlertTriangle = createReactComponent('AlertTriangle', [['path', {
  d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z',
  key: 'c3ski4'
}], ['line', {
  x1: '12',
  y1: '9',
  x2: '12',
  y2: '13',
  key: 'mb7vjk'
}], ['line', {
  x1: '12',
  y1: '17',
  x2: '12.01',
  y2: '17',
  key: 'kdstpg'
}]]);
var AlertTriangle$1 = AlertTriangle;

var AlignCenterHorizontal = createReactComponent('AlignCenterHorizontal', [['path', {
  d: 'M2 12h20',
  key: '9i4pu4'
}], ['path', {
  d: 'M10 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4',
  key: '11f1s0'
}], ['path', {
  d: 'M10 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4',
  key: 't14dx9'
}], ['path', {
  d: 'M20 16v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1',
  key: '1w07xs'
}], ['path', {
  d: 'M14 8V7c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v1',
  key: '1apec2'
}]]);
var AlignCenterHorizontal$1 = AlignCenterHorizontal;

var AlignCenterVertical = createReactComponent('AlignCenterVertical', [['path', {
  d: 'M12 2v20',
  key: 't6zp3m'
}], ['path', {
  d: 'M8 10H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h4',
  key: '14d6g8'
}], ['path', {
  d: 'M16 10h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4',
  key: '1e2lrw'
}], ['path', {
  d: 'M8 20H7a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1',
  key: '1fkdwx'
}], ['path', {
  d: 'M16 14h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1',
  key: '1euafb'
}]]);
var AlignCenterVertical$1 = AlignCenterVertical;

var AlignCenter = createReactComponent('AlignCenter', [['line', {
  x1: '21',
  y1: '6',
  x2: '3',
  y2: '6',
  key: '1e448z'
}], ['line', {
  x1: '17',
  y1: '12',
  x2: '7',
  y2: '12',
  key: 'driibe'
}], ['line', {
  x1: '19',
  y1: '18',
  x2: '5',
  y2: '18',
  key: '1i3xdx'
}]]);
var AlignCenter$1 = AlignCenter;

var AlignEndHorizontal = createReactComponent('AlignEndHorizontal', [['rect', {
  x: '4',
  y: '2',
  width: '6',
  height: '16',
  rx: '2',
  key: 'xp5u6c'
}], ['rect', {
  x: '14',
  y: '9',
  width: '6',
  height: '9',
  rx: '2',
  key: '1e039c'
}], ['path', {
  d: 'M22 22H2',
  key: '19qnx5'
}]]);
var AlignEndHorizontal$1 = AlignEndHorizontal;

var AlignEndVertical = createReactComponent('AlignEndVertical', [['rect', {
  x: '2',
  y: '4',
  width: '16',
  height: '6',
  rx: '2',
  key: '1j7b8s'
}], ['rect', {
  x: '9',
  y: '14',
  width: '9',
  height: '6',
  rx: '2',
  key: 'b2t4yo'
}], ['path', {
  d: 'M22 22V2',
  key: '12ipfv'
}]]);
var AlignEndVertical$1 = AlignEndVertical;

var AlignHorizontalDistributeCenter = createReactComponent('AlignHorizontalDistributeCenter', [['rect', {
  x: '4',
  y: '5',
  width: '6',
  height: '14',
  rx: '2',
  key: 'ric6yp'
}], ['rect', {
  x: '14',
  y: '7',
  width: '6',
  height: '10',
  rx: '2',
  key: '1mr5t1'
}], ['path', {
  d: 'M17 22v-5',
  key: '4b6g73'
}], ['path', {
  d: 'M17 7V2',
  key: 'hnrr36'
}], ['path', {
  d: 'M7 22v-3',
  key: '1r4jpn'
}], ['path', {
  d: 'M7 5V2',
  key: 'liy1u9'
}]]);
var AlignHorizontalDistributeCenter$1 = AlignHorizontalDistributeCenter;

var AlignHorizontalDistributeEnd = createReactComponent('AlignHorizontalDistributeEnd', [['rect', {
  x: '4',
  y: '5',
  width: '6',
  height: '14',
  rx: '2',
  key: 'ric6yp'
}], ['rect', {
  x: '14',
  y: '7',
  width: '6',
  height: '10',
  rx: '2',
  key: '1mr5t1'
}], ['path', {
  d: 'M10 2v20',
  key: 'uyc634'
}], ['path', {
  d: 'M20 2v20',
  key: '1tx262'
}]]);
var AlignHorizontalDistributeEnd$1 = AlignHorizontalDistributeEnd;

var AlignHorizontalDistributeStart = createReactComponent('AlignHorizontalDistributeStart', [['rect', {
  x: '4',
  y: '5',
  width: '6',
  height: '14',
  rx: '2',
  key: 'ric6yp'
}], ['rect', {
  x: '14',
  y: '7',
  width: '6',
  height: '10',
  rx: '2',
  key: '1mr5t1'
}], ['path', {
  d: 'M4 2v20',
  key: 'gtpd5x'
}], ['path', {
  d: 'M14 2v20',
  key: 'tg6bpw'
}]]);
var AlignHorizontalDistributeStart$1 = AlignHorizontalDistributeStart;

var AlignHorizontalJustifyCenter = createReactComponent('AlignHorizontalJustifyCenter', [['rect', {
  x: '2',
  y: '5',
  width: '6',
  height: '14',
  rx: '2',
  key: '15angl'
}], ['rect', {
  x: '16',
  y: '7',
  width: '6',
  height: '10',
  rx: '2',
  key: '1di99g'
}], ['path', {
  d: 'M12 2v20',
  key: 't6zp3m'
}]]);
var AlignHorizontalJustifyCenter$1 = AlignHorizontalJustifyCenter;

var AlignHorizontalJustifyEnd = createReactComponent('AlignHorizontalJustifyEnd', [['rect', {
  x: '2',
  y: '5',
  width: '6',
  height: '14',
  rx: '2',
  key: '15angl'
}], ['rect', {
  x: '12',
  y: '7',
  width: '6',
  height: '10',
  rx: '2',
  key: '150rwc'
}], ['path', {
  d: 'M22 2v20',
  key: '40qfg1'
}]]);
var AlignHorizontalJustifyEnd$1 = AlignHorizontalJustifyEnd;

var AlignHorizontalJustifyStart = createReactComponent('AlignHorizontalJustifyStart', [['rect', {
  x: '6',
  y: '5',
  width: '6',
  height: '14',
  rx: '2',
  key: '1mezge'
}], ['rect', {
  x: '16',
  y: '7',
  width: '6',
  height: '10',
  rx: '2',
  key: '1di99g'
}], ['path', {
  d: 'M2 2v20',
  key: '1ivd8o'
}]]);
var AlignHorizontalJustifyStart$1 = AlignHorizontalJustifyStart;

var AlignHorizontalSpaceAround = createReactComponent('AlignHorizontalSpaceAround', [['rect', {
  x: '9',
  y: '7',
  width: '6',
  height: '10',
  rx: '2',
  key: '7k3bt6'
}], ['path', {
  d: 'M4 22V2',
  key: 'tsjzd3'
}], ['path', {
  d: 'M20 22V2',
  key: '1bnhr8'
}]]);
var AlignHorizontalSpaceAround$1 = AlignHorizontalSpaceAround;

var AlignHorizontalSpaceBetween = createReactComponent('AlignHorizontalSpaceBetween', [['rect', {
  x: '3',
  y: '5',
  width: '6',
  height: '14',
  rx: '2',
  key: 'iybqme'
}], ['rect', {
  x: '15',
  y: '7',
  width: '6',
  height: '10',
  rx: '2',
  key: '11q98m'
}], ['path', {
  d: 'M3 2v20',
  key: '1d2pfg'
}], ['path', {
  d: 'M21 2v20',
  key: 'p059bm'
}]]);
var AlignHorizontalSpaceBetween$1 = AlignHorizontalSpaceBetween;

var AlignJustify = createReactComponent('AlignJustify', [['line', {
  x1: '3',
  y1: '6',
  x2: '21',
  y2: '6',
  key: '1tp2lp'
}], ['line', {
  x1: '3',
  y1: '12',
  x2: '21',
  y2: '12',
  key: '1aui40'
}], ['line', {
  x1: '3',
  y1: '18',
  x2: '21',
  y2: '18',
  key: '1sxo76'
}]]);
var AlignJustify$1 = AlignJustify;

var AlignLeft = createReactComponent('AlignLeft', [['line', {
  x1: '21',
  y1: '6',
  x2: '3',
  y2: '6',
  key: '1e448z'
}], ['line', {
  x1: '15',
  y1: '12',
  x2: '3',
  y2: '12',
  key: '80e4vw'
}], ['line', {
  x1: '17',
  y1: '18',
  x2: '3',
  y2: '18',
  key: '1771gn'
}]]);
var AlignLeft$1 = AlignLeft;

var AlignRight = createReactComponent('AlignRight', [['line', {
  x1: '21',
  y1: '6',
  x2: '3',
  y2: '6',
  key: '1e448z'
}], ['line', {
  x1: '21',
  y1: '12',
  x2: '9',
  y2: '12',
  key: '1stwgr'
}], ['line', {
  x1: '21',
  y1: '18',
  x2: '7',
  y2: '18',
  key: '1hion3'
}]]);
var AlignRight$1 = AlignRight;

var AlignStartHorizontal = createReactComponent('AlignStartHorizontal', [['rect', {
  x: '4',
  y: '6',
  width: '6',
  height: '16',
  rx: '2',
  key: '1l8oni'
}], ['rect', {
  x: '14',
  y: '6',
  width: '6',
  height: '9',
  rx: '2',
  key: '16r6cq'
}], ['path', {
  d: 'M22 2H2',
  key: 'fhrpnj'
}]]);
var AlignStartHorizontal$1 = AlignStartHorizontal;

var AlignStartVertical = createReactComponent('AlignStartVertical', [['rect', {
  x: '6',
  y: '14',
  width: '9',
  height: '6',
  rx: '2',
  key: 'pvftf3'
}], ['rect', {
  x: '6',
  y: '4',
  width: '16',
  height: '6',
  rx: '2',
  key: '1aj6m8'
}], ['path', {
  d: 'M2 2v20',
  key: '1ivd8o'
}]]);
var AlignStartVertical$1 = AlignStartVertical;

var AlignVerticalDistributeCenter = createReactComponent('AlignVerticalDistributeCenter', [['rect', {
  x: '5',
  y: '14',
  width: '14',
  height: '6',
  rx: '2',
  key: '1qrzuf'
}], ['rect', {
  x: '7',
  y: '4',
  width: '10',
  height: '6',
  rx: '2',
  key: 'we8e9z'
}], ['path', {
  d: 'M22 7h-5',
  key: 'o2endc'
}], ['path', {
  d: 'M7 7H1',
  key: '105l6j'
}], ['path', {
  d: 'M22 17h-3',
  key: '1lwga1'
}], ['path', {
  d: 'M5 17H2',
  key: '1gx9xc'
}]]);
var AlignVerticalDistributeCenter$1 = AlignVerticalDistributeCenter;

var AlignVerticalDistributeEnd = createReactComponent('AlignVerticalDistributeEnd', [['rect', {
  x: '5',
  y: '14',
  width: '14',
  height: '6',
  rx: '2',
  key: '1qrzuf'
}], ['rect', {
  x: '7',
  y: '4',
  width: '10',
  height: '6',
  rx: '2',
  key: 'we8e9z'
}], ['path', {
  d: 'M2 20h20',
  key: 'owomy5'
}], ['path', {
  d: 'M2 10h20',
  key: '1ir3d8'
}]]);
var AlignVerticalDistributeEnd$1 = AlignVerticalDistributeEnd;

var AlignVerticalDistributeStart = createReactComponent('AlignVerticalDistributeStart', [['rect', {
  x: '5',
  y: '14',
  width: '14',
  height: '6',
  rx: '2',
  key: '1qrzuf'
}], ['rect', {
  x: '7',
  y: '4',
  width: '10',
  height: '6',
  rx: '2',
  key: 'we8e9z'
}], ['path', {
  d: 'M2 14h20',
  key: 'myj16y'
}], ['path', {
  d: 'M2 4h20',
  key: 'mda7wb'
}]]);
var AlignVerticalDistributeStart$1 = AlignVerticalDistributeStart;

var AlignVerticalJustifyCenter = createReactComponent('AlignVerticalJustifyCenter', [['rect', {
  x: '5',
  y: '16',
  width: '14',
  height: '6',
  rx: '2',
  key: '1xmr5l'
}], ['rect', {
  x: '7',
  y: '2',
  width: '10',
  height: '6',
  rx: '2',
  key: '1dm79a'
}], ['path', {
  d: 'M2 12h20',
  key: '9i4pu4'
}]]);
var AlignVerticalJustifyCenter$1 = AlignVerticalJustifyCenter;

var AlignVerticalJustifyEnd = createReactComponent('AlignVerticalJustifyEnd', [['rect', {
  x: '5',
  y: '12',
  width: '14',
  height: '6',
  rx: '2',
  key: '12nflp'
}], ['rect', {
  x: '7',
  y: '2',
  width: '10',
  height: '6',
  rx: '2',
  key: '1dm79a'
}], ['path', {
  d: 'M2 22h20',
  key: '272qi7'
}]]);
var AlignVerticalJustifyEnd$1 = AlignVerticalJustifyEnd;

var AlignVerticalJustifyStart = createReactComponent('AlignVerticalJustifyStart', [['rect', {
  x: '5',
  y: '16',
  width: '14',
  height: '6',
  rx: '2',
  key: '1xmr5l'
}], ['rect', {
  x: '7',
  y: '6',
  width: '10',
  height: '6',
  rx: '2',
  key: 'q2ofyd'
}], ['path', {
  d: 'M2 2h20',
  key: '1ennik'
}]]);
var AlignVerticalJustifyStart$1 = AlignVerticalJustifyStart;

var AlignVerticalSpaceAround = createReactComponent('AlignVerticalSpaceAround', [['rect', {
  x: '7',
  y: '9',
  width: '10',
  height: '6',
  rx: '2',
  key: '1iy9tl'
}], ['path', {
  d: 'M22 20H2',
  key: '1p1f7z'
}], ['path', {
  d: 'M22 4H2',
  key: '1b7qnq'
}]]);
var AlignVerticalSpaceAround$1 = AlignVerticalSpaceAround;

var AlignVerticalSpaceBetween = createReactComponent('AlignVerticalSpaceBetween', [['rect', {
  x: '5',
  y: '15',
  width: '14',
  height: '6',
  rx: '2',
  key: 'hytrht'
}], ['rect', {
  x: '7',
  y: '3',
  width: '10',
  height: '6',
  rx: '2',
  key: 'y09b40'
}], ['path', {
  d: 'M2 21h20',
  key: '1nyx9w'
}], ['path', {
  d: 'M2 3h20',
  key: '91anmk'
}]]);
var AlignVerticalSpaceBetween$1 = AlignVerticalSpaceBetween;

var Anchor = createReactComponent('Anchor', [['circle', {
  cx: '12',
  cy: '5',
  r: '3',
  key: 'rqqgnr'
}], ['line', {
  x1: '12',
  y1: '22',
  x2: '12',
  y2: '8',
  key: '111jcv'
}], ['path', {
  d: 'M5 12H2a10 10 0 0 0 20 0h-3',
  key: '1hv3nh'
}]]);
var Anchor$1 = Anchor;

var Angry = createReactComponent('Angry', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['path', {
  d: 'M16 16s-1.5-2-4-2-4 2-4 2',
  key: 'epbg0q'
}], ['path', {
  d: 'M7.5 8 10 9',
  key: 'olxxln'
}], ['path', {
  d: 'm14 9 2.5-1',
  key: '1j6cij'
}], ['path', {
  d: 'M9 10h0',
  key: '1vxvly'
}], ['path', {
  d: 'M15 10h0',
  key: '1j6oav'
}]]);
var Angry$1 = Angry;

var Annoyed = createReactComponent('Annoyed', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['path', {
  d: 'M8 15h8',
  key: '45n4r'
}], ['path', {
  d: 'M8 9h2',
  key: '1g203m'
}], ['path', {
  d: 'M14 9h2',
  key: '116p9w'
}]]);
var Annoyed$1 = Annoyed;

var Aperture = createReactComponent('Aperture', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['line', {
  x1: '14.31',
  y1: '8',
  x2: '20.05',
  y2: '17.94',
  key: '1oqej7'
}], ['line', {
  x1: '9.69',
  y1: '8',
  x2: '21.17',
  y2: '8',
  key: '1cv19a'
}], ['line', {
  x1: '7.38',
  y1: '12',
  x2: '13.12',
  y2: '2.06',
  key: '1vh5oz'
}], ['line', {
  x1: '9.69',
  y1: '16',
  x2: '3.95',
  y2: '6.06',
  key: 'saeeuz'
}], ['line', {
  x1: '14.31',
  y1: '16',
  x2: '2.83',
  y2: '16',
  key: 'pq85rp'
}], ['line', {
  x1: '16.62',
  y1: '12',
  x2: '10.88',
  y2: '21.94',
  key: 'wactqi'
}]]);
var Aperture$1 = Aperture;

var Apple = createReactComponent('Apple', [['path', {
  d: 'M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z',
  key: '3s7exb'
}], ['path', {
  d: 'M10 2c1 .5 2 2 2 5',
  key: 'fcco2y'
}]]);
var Apple$1 = Apple;

var ArchiveRestore = createReactComponent('ArchiveRestore', [['rect', {
  x: '2',
  y: '4',
  width: '20',
  height: '5',
  rx: '2',
  key: '1h2p0l'
}], ['path', {
  d: 'M12 13v7',
  key: '1arz7h'
}], ['path', {
  d: 'm9 16 3-3 3 3',
  key: '1idcnm'
}], ['path', {
  d: 'M4 9v9a2 2 0 0 0 2 2h2',
  key: 'qxnby6'
}], ['path', {
  d: 'M20 9v9a2 2 0 0 1-2 2h-2',
  key: 'gz3jmx'
}]]);
var ArchiveRestore$1 = ArchiveRestore;

var Archive = createReactComponent('Archive', [['rect', {
  x: '2',
  y: '4',
  width: '20',
  height: '5',
  rx: '2',
  key: '1h2p0l'
}], ['path', {
  d: 'M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9',
  key: 'shkvi4'
}], ['path', {
  d: 'M10 13h4',
  key: 'ytezjc'
}]]);
var Archive$1 = Archive;

var Armchair = createReactComponent('Armchair', [['path', {
  d: 'M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3',
  key: 'irtipd'
}], ['path', {
  d: 'M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z',
  key: '1ed1m0'
}], ['path', {
  d: 'M5 18v2',
  key: 'ppbyun'
}], ['path', {
  d: 'M19 18v2',
  key: 'gy7782'
}]]);
var Armchair$1 = Armchair;

var ArrowBigDown = createReactComponent('ArrowBigDown', [['path', {
  d: 'M9 3h6v11h4l-7 7-7-7h4z',
  key: '6dczpq'
}]]);
var ArrowBigDown$1 = ArrowBigDown;

var ArrowBigLeft = createReactComponent('ArrowBigLeft', [['path', {
  d: 'm3 12 7-7v4h11v6H10v4z',
  key: '1e8ocp'
}]]);
var ArrowBigLeft$1 = ArrowBigLeft;

var ArrowBigRight = createReactComponent('ArrowBigRight', [['path', {
  d: 'm21 12-7-7v4H3v6h11v4z',
  key: '58zwfy'
}]]);
var ArrowBigRight$1 = ArrowBigRight;

var ArrowBigUp = createReactComponent('ArrowBigUp', [['path', {
  d: 'M9 21V10H5l7-7 7 7h-4v11z',
  key: '8tfmm3'
}]]);
var ArrowBigUp$1 = ArrowBigUp;

var ArrowDownCircle = createReactComponent('ArrowDownCircle', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '8 12 12 16 16 12',
  key: '14qdon'
}], ['line', {
  x1: '12',
  y1: '8',
  x2: '12',
  y2: '16',
  key: '55jlg'
}]]);
var ArrowDownCircle$1 = ArrowDownCircle;

var ArrowDownLeft = createReactComponent('ArrowDownLeft', [['line', {
  x1: '17',
  y1: '7',
  x2: '7',
  y2: '17',
  key: '1cuvd1'
}], ['polyline', {
  points: '17 17 7 17 7 7',
  key: 'aq42rd'
}]]);
var ArrowDownLeft$1 = ArrowDownLeft;

var ArrowDownRight = createReactComponent('ArrowDownRight', [['line', {
  x1: '7',
  y1: '7',
  x2: '17',
  y2: '17',
  key: 'dtegzv'
}], ['polyline', {
  points: '17 7 17 17 7 17',
  key: '1gmiis'
}]]);
var ArrowDownRight$1 = ArrowDownRight;

var ArrowDown = createReactComponent('ArrowDown', [['line', {
  x1: '12',
  y1: '5',
  x2: '12',
  y2: '19',
  key: 'myz83a'
}], ['polyline', {
  points: '19 12 12 19 5 12',
  key: '17kmxi'
}]]);
var ArrowDown$1 = ArrowDown;

var ArrowLeftCircle = createReactComponent('ArrowLeftCircle', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '12 8 8 12 12 16',
  key: 'bz1698'
}], ['line', {
  x1: '16',
  y1: '12',
  x2: '8',
  y2: '12',
  key: 'i2qu8k'
}]]);
var ArrowLeftCircle$1 = ArrowLeftCircle;

var ArrowLeftRight = createReactComponent('ArrowLeftRight', [['polyline', {
  points: '17 11 21 7 17 3',
  key: 'l3l6r3'
}], ['line', {
  x1: '21',
  y1: '7',
  x2: '9',
  y2: '7',
  key: '17x2jj'
}], ['polyline', {
  points: '7 21 3 17 7 13',
  key: 'lfumnw'
}], ['line', {
  x1: '15',
  y1: '17',
  x2: '3',
  y2: '17',
  key: 'gusd5o'
}]]);
var ArrowLeftRight$1 = ArrowLeftRight;

var ArrowLeft = createReactComponent('ArrowLeft', [['line', {
  x1: '19',
  y1: '12',
  x2: '5',
  y2: '12',
  key: '17g05t'
}], ['polyline', {
  points: '12 19 5 12 12 5',
  key: '1ksm0z'
}]]);
var ArrowLeft$1 = ArrowLeft;

var ArrowRightCircle = createReactComponent('ArrowRightCircle', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '12 16 16 12 12 8',
  key: '1byh5s'
}], ['line', {
  x1: '8',
  y1: '12',
  x2: '16',
  y2: '12',
  key: '1myapg'
}]]);
var ArrowRightCircle$1 = ArrowRightCircle;

var ArrowRight = createReactComponent('ArrowRight', [['line', {
  x1: '5',
  y1: '12',
  x2: '19',
  y2: '12',
  key: '1smlys'
}], ['polyline', {
  points: '12 5 19 12 12 19',
  key: 'sfr3i6'
}]]);
var ArrowRight$1 = ArrowRight;

var ArrowUpCircle = createReactComponent('ArrowUpCircle', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '16 12 12 8 8 12',
  key: '1gpmhk'
}], ['line', {
  x1: '12',
  y1: '16',
  x2: '12',
  y2: '8',
  key: 'r2mfdg'
}]]);
var ArrowUpCircle$1 = ArrowUpCircle;

var ArrowUpDown = createReactComponent('ArrowUpDown', [['polyline', {
  points: '11 17 7 21 3 17',
  key: 'dv0ycv'
}], ['line', {
  x1: '7',
  y1: '21',
  x2: '7',
  y2: '9',
  key: '1cxv4h'
}], ['polyline', {
  points: '21 7 17 3 13 7',
  key: '1su31j'
}], ['line', {
  x1: '17',
  y1: '15',
  x2: '17',
  y2: '3',
  key: 'r3527w'
}]]);
var ArrowUpDown$1 = ArrowUpDown;

var ArrowUpLeft = createReactComponent('ArrowUpLeft', [['line', {
  x1: '17',
  y1: '17',
  x2: '7',
  y2: '7',
  key: '814yaz'
}], ['polyline', {
  points: '7 17 7 7 17 7',
  key: '1jae2c'
}]]);
var ArrowUpLeft$1 = ArrowUpLeft;

var ArrowUpRight = createReactComponent('ArrowUpRight', [['line', {
  x1: '7',
  y1: '17',
  x2: '17',
  y2: '7',
  key: '16hgw2'
}], ['polyline', {
  points: '7 7 17 7 17 17',
  key: 'blehsp'
}]]);
var ArrowUpRight$1 = ArrowUpRight;

var ArrowUp = createReactComponent('ArrowUp', [['line', {
  x1: '12',
  y1: '19',
  x2: '12',
  y2: '5',
  key: 'yrd7g6'
}], ['polyline', {
  points: '5 12 12 5 19 12',
  key: '1y7d7k'
}]]);
var ArrowUp$1 = ArrowUp;

var Asterisk = createReactComponent('Asterisk', [['path', {
  d: 'M12 6v12',
  key: '1vza4d'
}], ['path', {
  d: 'M17.196 9 6.804 15',
  key: '1ah31z'
}], ['path', {
  d: 'm6.804 9 10.392 6',
  key: '1b6pxd'
}]]);
var Asterisk$1 = Asterisk;

var AtSign = createReactComponent('AtSign', [['circle', {
  cx: '12',
  cy: '12',
  r: '4',
  key: '4exip2'
}], ['path', {
  d: 'M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94',
  key: '1m6qx5'
}]]);
var AtSign$1 = AtSign;

var Award = createReactComponent('Award', [['circle', {
  cx: '12',
  cy: '8',
  r: '6',
  key: '1vp47v'
}], ['path', {
  d: 'M15.477 12.89 17 22l-5-3-5 3 1.523-9.11',
  key: 'em7aur'
}]]);
var Award$1 = Award;

var Axe = createReactComponent('Axe', [['path', {
  d: 'm14 12-8.501 8.501a2.12 2.12 0 0 1-2.998 0h-.002a2.12 2.12 0 0 1 0-2.998L11 9.002',
  key: 'ha6v2k'
}], ['path', {
  d: 'm9 7 4-4 6 6h3l-.13.648a7.648 7.648 0 0 1-5.081 5.756L15 16v-3z',
  key: '1mosh2'
}]]);
var Axe$1 = Axe;

var Axis3d = createReactComponent('Axis3d', [['path', {
  d: 'M4 4v16h16',
  key: '1s015l'
}], ['path', {
  d: 'm4 20 7-7',
  key: '17qe9y'
}]]);
var Axis3d$1 = Axis3d;

var Baby = createReactComponent('Baby', [['path', {
  d: 'M9 12h0',
  key: 't9r911'
}], ['path', {
  d: 'M15 12h0',
  key: '1pk9dm'
}], ['path', {
  d: 'M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5',
  key: '1u7htd'
}], ['path', {
  d: 'M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1',
  key: '5yv0yz'
}]]);
var Baby$1 = Baby;

var Backpack = createReactComponent('Backpack', [['path', {
  d: 'M4 20V10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z',
  key: 'tunmdx'
}], ['path', {
  d: 'M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2',
  key: 'donm21'
}], ['path', {
  d: 'M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5',
  key: 'xk3gvk'
}], ['path', {
  d: 'M8 10h8',
  key: 'c7uz4u'
}], ['path', {
  d: 'M8 18h8',
  key: '1no2b1'
}]]);
var Backpack$1 = Backpack;

var BaggageClaim = createReactComponent('BaggageClaim', [['path', {
  d: 'M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2',
  key: '4irg2o'
}], ['path', {
  d: 'M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10',
  key: '14fcyx'
}], ['rect', {
  x: '8',
  y: '6',
  width: '13',
  height: '8',
  rx: '1',
  key: '1sfr2f'
}], ['circle', {
  cx: '18',
  cy: '20',
  r: '2',
  key: 't9985n'
}], ['circle', {
  cx: '9',
  cy: '20',
  r: '2',
  key: 'e5v82j'
}]]);
var BaggageClaim$1 = BaggageClaim;

var Banana = createReactComponent('Banana', [['path', {
  d: 'M4 13c3.5-2 8-2 10 2a5.5 5.5 0 0 1 8 5',
  key: '1cscit'
}], ['path', {
  d: 'M5.15 17.89c5.52-1.52 8.65-6.89 7-12C11.55 4 11.5 2 13 2c3.22 0 5 5.5 5 8 0 6.5-4.2 12-10.49 12C5.11 22 2 22 2 20c0-1.5 1.14-1.55 3.15-2.11Z',
  key: '1y1nbv'
}]]);
var Banana$1 = Banana;

var Banknote = createReactComponent('Banknote', [['rect', {
  x: '2',
  y: '6',
  width: '20',
  height: '12',
  rx: '2',
  key: '1wpnh2'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '2',
  key: '1c9p78'
}], ['path', {
  d: 'M6 12h.01M18 12h.01',
  key: '113zkx'
}]]);
var Banknote$1 = Banknote;

var BarChart2 = createReactComponent('BarChart2', [['line', {
  x1: '18',
  y1: '20',
  x2: '18',
  y2: '10',
  key: '1e8c49'
}], ['line', {
  x1: '12',
  y1: '20',
  x2: '12',
  y2: '4',
  key: '65j799'
}], ['line', {
  x1: '6',
  y1: '20',
  x2: '6',
  y2: '14',
  key: '4svqks'
}]]);
var BarChart2$1 = BarChart2;

var BarChart3 = createReactComponent('BarChart3', [['path', {
  d: 'M3 3v18h18',
  key: '1s2lah'
}], ['path', {
  d: 'M18 17V9',
  key: '2bz60n'
}], ['path', {
  d: 'M13 17V5',
  key: '1frdt8'
}], ['path', {
  d: 'M8 17v-3',
  key: '17ska0'
}]]);
var BarChart3$1 = BarChart3;

var BarChart4 = createReactComponent('BarChart4', [['path', {
  d: 'M3 3v18h18',
  key: '1s2lah'
}], ['path', {
  d: 'M13 17V9',
  key: '1fwyjl'
}], ['path', {
  d: 'M18 17V5',
  key: 'sfb6ij'
}], ['path', {
  d: 'M8 17v-3',
  key: '17ska0'
}]]);
var BarChart4$1 = BarChart4;

var BarChartHorizontal = createReactComponent('BarChartHorizontal', [['path', {
  d: 'M3 3v18h18',
  key: '1s2lah'
}], ['path', {
  d: 'M7 16h8',
  key: 'srdodz'
}], ['path', {
  d: 'M7 11h12',
  key: '127s9w'
}], ['path', {
  d: 'M7 6h3',
  key: 'w9rmul'
}]]);
var BarChartHorizontal$1 = BarChartHorizontal;

var BarChart = createReactComponent('BarChart', [['line', {
  x1: '12',
  y1: '20',
  x2: '12',
  y2: '10',
  key: '1wi7jb'
}], ['line', {
  x1: '18',
  y1: '20',
  x2: '18',
  y2: '4',
  key: '1mwru6'
}], ['line', {
  x1: '6',
  y1: '20',
  x2: '6',
  y2: '16',
  key: 'zj13da'
}]]);
var BarChart$1 = BarChart;

var Baseline = createReactComponent('Baseline', [['path', {
  d: 'M4 20h16',
  key: '14thso'
}], ['path', {
  d: 'm6 16 6-12 6 12',
  key: '1b4byz'
}], ['path', {
  d: 'M8 12h8',
  key: '1wcyev'
}]]);
var Baseline$1 = Baseline;

var Bath = createReactComponent('Bath', [['path', {
  d: 'M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5',
  key: '1r8yf5'
}], ['line', {
  x1: '10',
  y1: '5',
  x2: '8',
  y2: '7',
  key: 'd858pc'
}], ['line', {
  x1: '2',
  y1: '12',
  x2: '22',
  y2: '12',
  key: 'zvmn4p'
}], ['line', {
  x1: '7',
  y1: '19',
  x2: '7',
  y2: '21',
  key: 'cpl2n4'
}], ['line', {
  x1: '17',
  y1: '19',
  x2: '17',
  y2: '21',
  key: 'ywtigw'
}]]);
var Bath$1 = Bath;

var BatteryCharging = createReactComponent('BatteryCharging', [['path', {
  d: 'M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2',
  key: '1sdynx'
}], ['path', {
  d: 'M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1',
  key: '1gkd3k'
}], ['path', {
  d: 'm11 7-3 5h4l-3 5',
  key: 'b4a64w'
}], ['line', {
  x1: '22',
  x2: '22',
  y1: '11',
  y2: '13',
  key: '4dh1rd'
}]]);
var BatteryCharging$1 = BatteryCharging;

var BatteryFull = createReactComponent('BatteryFull', [['rect', {
  x: '2',
  y: '7',
  width: '16',
  height: '10',
  rx: '2',
  ry: '2',
  key: '5j9scf'
}], ['line', {
  x1: '22',
  x2: '22',
  y1: '11',
  y2: '13',
  key: '4dh1rd'
}], ['line', {
  x1: '6',
  x2: '6',
  y1: '11',
  y2: '13',
  key: '1wd6dw'
}], ['line', {
  x1: '10',
  x2: '10',
  y1: '11',
  y2: '13',
  key: 'haxvl5'
}], ['line', {
  x1: '14',
  x2: '14',
  y1: '11',
  y2: '13',
  key: 'c6fn6x'
}]]);
var BatteryFull$1 = BatteryFull;

var BatteryLow = createReactComponent('BatteryLow', [['rect', {
  x: '2',
  y: '7',
  width: '16',
  height: '10',
  rx: '2',
  ry: '2',
  key: '5j9scf'
}], ['line', {
  x1: '22',
  x2: '22',
  y1: '11',
  y2: '13',
  key: '4dh1rd'
}], ['line', {
  x1: '6',
  x2: '6',
  y1: '11',
  y2: '13',
  key: '1wd6dw'
}]]);
var BatteryLow$1 = BatteryLow;

var BatteryMedium = createReactComponent('BatteryMedium', [['rect', {
  x: '2',
  y: '7',
  width: '16',
  height: '10',
  rx: '2',
  ry: '2',
  key: '5j9scf'
}], ['line', {
  x1: '22',
  x2: '22',
  y1: '11',
  y2: '13',
  key: '4dh1rd'
}], ['line', {
  x1: '6',
  x2: '6',
  y1: '11',
  y2: '13',
  key: '1wd6dw'
}], ['line', {
  x1: '10',
  x2: '10',
  y1: '11',
  y2: '13',
  key: 'haxvl5'
}]]);
var BatteryMedium$1 = BatteryMedium;

var Battery = createReactComponent('Battery', [['rect', {
  x: '2',
  y: '7',
  width: '16',
  height: '10',
  rx: '2',
  ry: '2',
  key: '5j9scf'
}], ['line', {
  x1: '22',
  x2: '22',
  y1: '11',
  y2: '13',
  key: '4dh1rd'
}]]);
var Battery$1 = Battery;

var Beaker = createReactComponent('Beaker', [['path', {
  d: 'M4.5 3h15',
  key: 'c7n0jr'
}], ['path', {
  d: 'M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3',
  key: 'm1uhx7'
}], ['path', {
  d: 'M6 14h12',
  key: '4cwo0f'
}]]);
var Beaker$1 = Beaker;

var BedDouble = createReactComponent('BedDouble', [['path', {
  d: 'M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8',
  key: '1k78r4'
}], ['path', {
  d: 'M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4',
  key: 'fb3tl2'
}], ['path', {
  d: 'M12 4v6',
  key: '1dcgq2'
}], ['path', {
  d: 'M2 18h20',
  key: 'ajqnye'
}]]);
var BedDouble$1 = BedDouble;

var BedSingle = createReactComponent('BedSingle', [['path', {
  d: 'M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8',
  key: '1wm6mi'
}], ['path', {
  d: 'M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4',
  key: '4k93s5'
}], ['path', {
  d: 'M3 18h18',
  key: '1h113x'
}]]);
var BedSingle$1 = BedSingle;

var Bed = createReactComponent('Bed', [['path', {
  d: 'M2 4v16',
  key: 'vw9hq8'
}], ['path', {
  d: 'M2 8h18a2 2 0 0 1 2 2v10',
  key: '1dgv2r'
}], ['path', {
  d: 'M2 17h20',
  key: '18nfp3'
}], ['path', {
  d: 'M6 8v9',
  key: '1yriud'
}]]);
var Bed$1 = Bed;

var Beer = createReactComponent('Beer', [['path', {
  d: 'M17 11h1a3 3 0 0 1 0 6h-1',
  key: '1yp76v'
}], ['path', {
  d: 'M9 12v6',
  key: '1u1cab'
}], ['path', {
  d: 'M13 12v6',
  key: '1sugkk'
}], ['path', {
  d: 'M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z',
  key: '1510fo'
}], ['path', {
  d: 'M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8',
  key: '19jb7n'
}]]);
var Beer$1 = Beer;

var BellMinus = createReactComponent('BellMinus', [['path', {
  d: 'M13.73 21a2 2 0 0 1-3.46 0',
  key: '6o5tke'
}], ['path', {
  d: 'M21 5h-6',
  key: '14nobq'
}], ['path', {
  d: 'M18.021 9C18.29 15.193 21 17 21 17H3s3-2 3-9a6 6 0 0 1 7-5.916',
  key: '1wldvb'
}]]);
var BellMinus$1 = BellMinus;

var BellOff = createReactComponent('BellOff', [['path', {
  d: 'M13.73 21a2 2 0 0 1-3.46 0',
  key: '6o5tke'
}], ['path', {
  d: 'M18.63 13A17.888 17.888 0 0 1 18 8',
  key: 'd5seqe'
}], ['path', {
  d: 'M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14',
  key: 'cae0gx'
}], ['path', {
  d: 'M18 8a6 6 0 0 0-9.33-5',
  key: '4mngwl'
}], ['path', {
  d: 'm2 2 20 20',
  key: '1ooewy'
}]]);
var BellOff$1 = BellOff;

var BellPlus = createReactComponent('BellPlus', [['path', {
  d: 'M18.387 12C19.198 15.799 21 17 21 17H3s3-2 3-9a6 6 0 0 1 7-5.916',
  key: '1dhkt2'
}], ['path', {
  d: 'M13.73 21a2 2 0 0 1-3.46 0',
  key: '6o5tke'
}], ['path', {
  d: 'M18 2v6',
  key: '163kbd'
}], ['path', {
  d: 'M21 5h-6',
  key: '14nobq'
}]]);
var BellPlus$1 = BellPlus;

var BellRing = createReactComponent('BellRing', [['path', {
  d: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9',
  key: 'oql5b8'
}], ['path', {
  d: 'M13.73 21a2 2 0 0 1-3.46 0',
  key: '6o5tke'
}], ['path', {
  d: 'M2 8c0-2.2.7-4.3 2-6',
  key: '1c7u9x'
}], ['path', {
  d: 'M22 8a10 10 0 0 0-2-6',
  key: '1vnyda'
}]]);
var BellRing$1 = BellRing;

var Bell = createReactComponent('Bell', [['path', {
  d: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9',
  key: 'oql5b8'
}], ['path', {
  d: 'M13.73 21a2 2 0 0 1-3.46 0',
  key: '6o5tke'
}]]);
var Bell$1 = Bell;

var Bike = createReactComponent('Bike', [['circle', {
  cx: '5.5',
  cy: '17.5',
  r: '3.5',
  key: '1noe27'
}], ['circle', {
  cx: '18.5',
  cy: '17.5',
  r: '3.5',
  key: '15x4ox'
}], ['path', {
  d: 'M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2',
  key: '1932na'
}]]);
var Bike$1 = Bike;

var Binary = createReactComponent('Binary', [['path', {
  d: 'M6 20h4',
  key: '1i6q5t'
}], ['path', {
  d: 'M14 10h4',
  key: 'ru81e7'
}], ['path', {
  d: 'M6 14h2v6',
  key: '16z9wg'
}], ['path', {
  d: 'M14 4h2v6',
  key: '1idq9u'
}], ['rect', {
  x: '6',
  y: '4',
  width: '4',
  height: '6',
  key: 'btwfzx'
}], ['rect', {
  x: '14',
  y: '14',
  width: '4',
  height: '6',
  key: '1cym0j'
}]]);
var Binary$1 = Binary;

var Bitcoin = createReactComponent('Bitcoin', [['path', {
  d: 'M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727',
  key: 'yr8idg'
}]]);
var Bitcoin$1 = Bitcoin;

var BluetoothConnected = createReactComponent('BluetoothConnected', [['path', {
  d: 'm7 7 10 10-5 5V2l5 5L7 17',
  key: '1q5490'
}], ['line', {
  x1: '18',
  y1: '12',
  y2: '12',
  x2: '21',
  key: '17rheb'
}], ['line', {
  x1: '3',
  y1: '12',
  y2: '12',
  x2: '6',
  key: '1l5nc6'
}]]);
var BluetoothConnected$1 = BluetoothConnected;

var BluetoothOff = createReactComponent('BluetoothOff', [['path', {
  d: 'm17 17-5 5V12l-5 5',
  key: 'v5aci6'
}], ['path', {
  d: 'm2 2 20 20',
  key: '1ooewy'
}], ['path', {
  d: 'M14.5 9.5 17 7l-5-5v4.5',
  key: '1kddfz'
}]]);
var BluetoothOff$1 = BluetoothOff;

var BluetoothSearching = createReactComponent('BluetoothSearching', [['path', {
  d: 'm7 7 10 10-5 5V2l5 5L7 17',
  key: '1q5490'
}], ['path', {
  d: 'M20.83 14.83a4 4 0 0 0 0-5.66',
  key: 'k8tn1j'
}], ['path', {
  d: 'M18 12h.01',
  key: 'yjnet6'
}]]);
var BluetoothSearching$1 = BluetoothSearching;

var Bluetooth = createReactComponent('Bluetooth', [['path', {
  d: 'm7 7 10 10-5 5V2l5 5L7 17',
  key: '1q5490'
}]]);
var Bluetooth$1 = Bluetooth;

var Bold = createReactComponent('Bold', [['path', {
  d: 'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z',
  key: 'shhoi5'
}], ['path', {
  d: 'M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z',
  key: 'jaah4r'
}]]);
var Bold$1 = Bold;

var Bomb = createReactComponent('Bomb', [['circle', {
  cx: '11',
  cy: '13',
  r: '9',
  key: 'hd149'
}], ['path', {
  d: 'm19.5 9.5 1.8-1.8a2.4 2.4 0 0 0 0-3.4l-1.6-1.6a2.41 2.41 0 0 0-3.4 0l-1.8 1.8',
  key: '9owvxi'
}], ['path', {
  d: 'm22 2-1.5 1.5',
  key: 'ay92ug'
}]]);
var Bomb$1 = Bomb;

var Bone = createReactComponent('Bone', [['path', {
  d: 'M18.6 9.82c-.52-.21-1.15-.25-1.54.15l-7.07 7.06c-.39.39-.36 1.03-.15 1.54.12.3.16.6.16.93a2.5 2.5 0 0 1-5 0c0-.26-.24-.5-.5-.5a2.5 2.5 0 1 1 .96-4.82c.5.21 1.14.25 1.53-.15l7.07-7.06c.39-.39.36-1.03.15-1.54-.12-.3-.21-.6-.21-.93a2.5 2.5 0 0 1 5 0c.01.26.24.49.5.5a2.5 2.5 0 1 1-.9 4.82Z',
  key: '134x1i'
}]]);
var Bone$1 = Bone;

var BookOpenCheck = createReactComponent('BookOpenCheck', [['path', {
  d: 'M8 3H2v15h7c1.7 0 3 1.3 3 3V7c0-2.2-1.8-4-4-4Z',
  key: '1i8u0n'
}], ['path', {
  d: 'm16 12 2 2 4-4',
  key: 'mdajum'
}], ['path', {
  d: 'M22 6V3h-6c-2.2 0-4 1.8-4 4v14c0-1.7 1.3-3 3-3h7v-2.3',
  key: 'jb5l51'
}]]);
var BookOpenCheck$1 = BookOpenCheck;

var BookOpen = createReactComponent('BookOpen', [['path', {
  d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z',
  key: 'vv98re'
}], ['path', {
  d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  key: '1cyq3y'
}]]);
var BookOpen$1 = BookOpen;

var Book = createReactComponent('Book', [['path', {
  d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20',
  key: '126fyg'
}], ['path', {
  d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  key: '1msh16'
}]]);
var Book$1 = Book;

var BookmarkMinus = createReactComponent('BookmarkMinus', [['path', {
  d: 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z',
  key: '1fy3hk'
}], ['line', {
  x1: '15',
  x2: '9',
  y1: '10',
  y2: '10',
  key: '1gty7f'
}]]);
var BookmarkMinus$1 = BookmarkMinus;

var BookmarkPlus = createReactComponent('BookmarkPlus', [['path', {
  d: 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z',
  key: '1fy3hk'
}], ['line', {
  x1: '12',
  x2: '12',
  y1: '7',
  y2: '13',
  key: '1cppfj'
}], ['line', {
  x1: '15',
  x2: '9',
  y1: '10',
  y2: '10',
  key: '1gty7f'
}]]);
var BookmarkPlus$1 = BookmarkPlus;

var Bookmark = createReactComponent('Bookmark', [['path', {
  d: 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z',
  key: '1fy3hk'
}]]);
var Bookmark$1 = Bookmark;

var Bot = createReactComponent('Bot', [['rect', {
  x: '3',
  y: '11',
  width: '18',
  height: '10',
  rx: '2',
  key: 'qbqwso'
}], ['circle', {
  cx: '12',
  cy: '5',
  r: '2',
  key: 'f1ur92'
}], ['path', {
  d: 'M12 7v4',
  key: 'xawao1'
}], ['line', {
  x1: '8',
  y1: '16',
  x2: '8',
  y2: '16',
  key: '717jkb'
}], ['line', {
  x1: '16',
  y1: '16',
  x2: '16',
  y2: '16',
  key: '19gr12'
}]]);
var Bot$1 = Bot;

var BoxSelect = createReactComponent('BoxSelect', [['path', {
  d: 'M5 3a2 2 0 0 0-2 2',
  key: 'y57alp'
}], ['path', {
  d: 'M19 3a2 2 0 0 1 2 2',
  key: '18rm91'
}], ['path', {
  d: 'M21 19a2 2 0 0 1-2 2',
  key: '1j7049'
}], ['path', {
  d: 'M5 21a2 2 0 0 1-2-2',
  key: 'sbafld'
}], ['path', {
  d: 'M9 3h1',
  key: '1yesri'
}], ['path', {
  d: 'M9 21h1',
  key: '15o7lz'
}], ['path', {
  d: 'M14 3h1',
  key: '1ec4yj'
}], ['path', {
  d: 'M14 21h1',
  key: 'v9vybs'
}], ['path', {
  d: 'M3 9v1',
  key: '1r0deq'
}], ['path', {
  d: 'M21 9v1',
  key: 'mxsmne'
}], ['path', {
  d: 'M3 14v1',
  key: 'vnatye'
}], ['path', {
  d: 'M21 14v1',
  key: '169vum'
}]]);
var BoxSelect$1 = BoxSelect;

var Box = createReactComponent('Box', [['path', {
  d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  key: 'yt0hxn'
}], ['polyline', {
  points: '3.29 7 12 12 20.71 7',
  key: 'ousv84'
}], ['line', {
  x1: '12',
  y1: '22',
  x2: '12',
  y2: '12',
  key: 'gdv6h4'
}]]);
var Box$1 = Box;

var Boxes = createReactComponent('Boxes', [['path', {
  d: 'M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z',
  key: 'lc1i9w'
}], ['path', {
  d: 'm7 16.5-4.74-2.85',
  key: '1o9zyk'
}], ['path', {
  d: 'm7 16.5 5-3',
  key: 'va8pkn'
}], ['path', {
  d: 'M7 16.5v5.17',
  key: 'jnp8gn'
}], ['path', {
  d: 'M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z',
  key: '8zsnat'
}], ['path', {
  d: 'm17 16.5-5-3',
  key: '8arw3v'
}], ['path', {
  d: 'm17 16.5 4.74-2.85',
  key: '8rfmw'
}], ['path', {
  d: 'M17 16.5v5.17',
  key: 'k6z78m'
}], ['path', {
  d: 'M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z',
  key: '1xygjf'
}], ['path', {
  d: 'M12 8 7.26 5.15',
  key: '1vbdud'
}], ['path', {
  d: 'm12 8 4.74-2.85',
  key: '3rx089'
}], ['path', {
  d: 'M12 13.5V8',
  key: '1io7kd'
}]]);
var Boxes$1 = Boxes;

var Briefcase = createReactComponent('Briefcase', [['rect', {
  x: '2',
  y: '7',
  width: '20',
  height: '14',
  rx: '2',
  ry: '2',
  key: '1fj28a'
}], ['path', {
  d: 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
  key: 'zwj3tp'
}]]);
var Briefcase$1 = Briefcase;

var Brush = createReactComponent('Brush', [['path', {
  d: 'm9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08',
  key: '1styjt'
}], ['path', {
  d: 'M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z',
  key: 'z0l1mu'
}]]);
var Brush$1 = Brush;

var Bug = createReactComponent('Bug', [['rect', {
  width: '8',
  height: '14',
  x: '8',
  y: '6',
  rx: '4',
  key: 'hq8nra'
}], ['path', {
  d: 'm19 7-3 2',
  key: 'fmg8ec'
}], ['path', {
  d: 'm5 7 3 2',
  key: 'dkxqes'
}], ['path', {
  d: 'm19 19-3-2',
  key: '1hbhi4'
}], ['path', {
  d: 'm5 19 3-2',
  key: 'dvt2ee'
}], ['path', {
  d: 'M20 13h-4',
  key: '1agfp2'
}], ['path', {
  d: 'M4 13h4',
  key: '1bwh8b'
}], ['path', {
  d: 'm10 4 1 2',
  key: '1pot59'
}], ['path', {
  d: 'm14 4-1 2',
  key: 'm8sn0o'
}]]);
var Bug$1 = Bug;

var Building2 = createReactComponent('Building2', [['path', {
  d: 'M6 22V4c0-.27 0-.55.07-.82a1.477 1.477 0 0 1 1.1-1.11C7.46 2 8.73 2 9 2h7c.27 0 .55 0 .82.07a1.477 1.477 0 0 1 1.11 1.1c.07.28.07.56.07.83v18H6Z',
  key: '1b1x9d'
}], ['path', {
  d: 'M2 14v6c0 1.1.9 2 2 2h2V12H4c-.27 0-.55 0-.82.07-.27.07-.52.2-.72.4-.19.19-.32.44-.39.71A3.4 3.4 0 0 0 2 14Z',
  key: '12g3jd'
}], ['path', {
  d: 'M20.82 9.07A3.4 3.4 0 0 0 20 9h-2v13h2a2 2 0 0 0 2-2v-9c0-.28 0-.55-.07-.82-.07-.27-.2-.52-.4-.72-.19-.19-.44-.32-.71-.39Z',
  key: 'o1w3ll'
}], ['path', {
  d: 'M10 6h4',
  key: '1itunk'
}], ['path', {
  d: 'M10 10h4',
  key: 'tcdvrf'
}], ['path', {
  d: 'M10 14h4',
  key: 'kelpxr'
}], ['path', {
  d: 'M10 18h4',
  key: '1ulq68'
}]]);
var Building2$1 = Building2;

var Building = createReactComponent('Building', [['rect', {
  x: '4',
  y: '2',
  width: '16',
  height: '20',
  rx: '2',
  ry: '2',
  key: '152kg8'
}], ['path', {
  d: 'M9 22v-4h6v4',
  key: 'r93iot'
}], ['path', {
  d: 'M8 6h.01',
  key: '1dz90k'
}], ['path', {
  d: 'M16 6h.01',
  key: '1x0f13'
}], ['path', {
  d: 'M12 6h.01',
  key: '1vi96p'
}], ['path', {
  d: 'M12 10h.01',
  key: '1nrarc'
}], ['path', {
  d: 'M12 14h.01',
  key: '1etili'
}], ['path', {
  d: 'M16 10h.01',
  key: '1m94wz'
}], ['path', {
  d: 'M16 14h.01',
  key: '1gbofw'
}], ['path', {
  d: 'M8 10h.01',
  key: '19clt8'
}], ['path', {
  d: 'M8 14h.01',
  key: '6423bh'
}]]);
var Building$1 = Building;

var Bus = createReactComponent('Bus', [['path', {
  d: 'M19 17h2l.64-2.54c.24-.959.24-1.962 0-2.92l-1.07-4.27A3 3 0 0 0 17.66 5H4a2 2 0 0 0-2 2v10h2',
  key: 'wfsdqh'
}], ['path', {
  d: 'M14 17H9',
  key: 'o2noo5'
}], ['circle', {
  cx: '6.5',
  cy: '17.5',
  r: '2.5',
  key: 'gc8oob'
}], ['circle', {
  cx: '16.5',
  cy: '17.5',
  r: '2.5',
  key: '4btu0q'
}]]);
var Bus$1 = Bus;

var Cake = createReactComponent('Cake', [['path', {
  d: 'M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8',
  key: '1w3rig'
}], ['path', {
  d: 'M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1',
  key: 'n2jgmb'
}], ['path', {
  d: 'M2 21h20',
  key: '1nyx9w'
}], ['path', {
  d: 'M7 8v2',
  key: 'kqglng'
}], ['path', {
  d: 'M12 8v2',
  key: '1woqiv'
}], ['path', {
  d: 'M17 8v2',
  key: 'teptal'
}], ['path', {
  d: 'M7 4h.01',
  key: '1bh4kh'
}], ['path', {
  d: 'M12 4h.01',
  key: '1ujb9j'
}], ['path', {
  d: 'M17 4h.01',
  key: '1upcoc'
}]]);
var Cake$1 = Cake;

var Calculator = createReactComponent('Calculator', [['rect', {
  x: '4',
  y: '2',
  width: '16',
  height: '20',
  rx: '2',
  key: '1uxh74'
}], ['line', {
  x1: '8',
  x2: '16',
  y1: '6',
  y2: '6',
  key: 'x4nwl0'
}], ['line', {
  x1: '16',
  x2: '16',
  y1: '14',
  y2: '18',
  key: 'wjye3r'
}], ['path', {
  d: 'M16 10h.01',
  key: '1m94wz'
}], ['path', {
  d: 'M12 10h.01',
  key: '1nrarc'
}], ['path', {
  d: 'M8 10h.01',
  key: '19clt8'
}], ['path', {
  d: 'M12 14h.01',
  key: '1etili'
}], ['path', {
  d: 'M8 14h.01',
  key: '6423bh'
}], ['path', {
  d: 'M12 18h.01',
  key: 'mhygvu'
}], ['path', {
  d: 'M8 18h.01',
  key: 'lrp35t'
}]]);
var Calculator$1 = Calculator;

var CalendarCheck2 = createReactComponent('CalendarCheck2', [['path', {
  d: 'M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8',
  key: 'bce9hv'
}], ['line', {
  x1: '16',
  y1: '2',
  x2: '16',
  y2: '6',
  key: '18saeg'
}], ['line', {
  x1: '8',
  y1: '2',
  x2: '8',
  y2: '6',
  key: '1u51jw'
}], ['line', {
  x1: '3',
  y1: '10',
  x2: '21',
  y2: '10',
  key: '6sq0yj'
}], ['path', {
  d: 'm16 20 2 2 4-4',
  key: '13tcca'
}]]);
var CalendarCheck2$1 = CalendarCheck2;

var CalendarCheck = createReactComponent('CalendarCheck', [['rect', {
  x: '3',
  y: '4',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: '1dtxiw'
}], ['line', {
  x1: '16',
  y1: '2',
  x2: '16',
  y2: '6',
  key: '18saeg'
}], ['line', {
  x1: '8',
  y1: '2',
  x2: '8',
  y2: '6',
  key: '1u51jw'
}], ['line', {
  x1: '3',
  y1: '10',
  x2: '21',
  y2: '10',
  key: '6sq0yj'
}], ['path', {
  d: 'm9 16 2 2 4-4',
  key: '19s6y9'
}]]);
var CalendarCheck$1 = CalendarCheck;

var CalendarClock = createReactComponent('CalendarClock', [['path', {
  d: 'M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5',
  key: '1osxxc'
}], ['path', {
  d: 'M16 2v4',
  key: '4m81vk'
}], ['path', {
  d: 'M8 2v4',
  key: '1cmpym'
}], ['path', {
  d: 'M3 10h5',
  key: 'r794hk'
}], ['path', {
  d: 'M17.5 17.5 16 16.25V14',
  key: 're2vv1'
}], ['path', {
  d: 'M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z',
  key: 'ame013'
}]]);
var CalendarClock$1 = CalendarClock;

var CalendarDays = createReactComponent('CalendarDays', [['rect', {
  x: '3',
  y: '4',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: '1dtxiw'
}], ['line', {
  x1: '16',
  y1: '2',
  x2: '16',
  y2: '6',
  key: '18saeg'
}], ['line', {
  x1: '8',
  y1: '2',
  x2: '8',
  y2: '6',
  key: '1u51jw'
}], ['line', {
  x1: '3',
  y1: '10',
  x2: '21',
  y2: '10',
  key: '6sq0yj'
}], ['path', {
  d: 'M8 14h.01',
  key: '6423bh'
}], ['path', {
  d: 'M12 14h.01',
  key: '1etili'
}], ['path', {
  d: 'M16 14h.01',
  key: '1gbofw'
}], ['path', {
  d: 'M8 18h.01',
  key: 'lrp35t'
}], ['path', {
  d: 'M12 18h.01',
  key: 'mhygvu'
}], ['path', {
  d: 'M16 18h.01',
  key: 'kzsmim'
}]]);
var CalendarDays$1 = CalendarDays;

var CalendarHeart = createReactComponent('CalendarHeart', [['path', {
  d: 'M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h7',
  key: '1sfrvf'
}], ['path', {
  d: 'M16 2v4',
  key: '4m81vk'
}], ['path', {
  d: 'M8 2v4',
  key: '1cmpym'
}], ['path', {
  d: 'M3 10h18',
  key: '8toen8'
}], ['path', {
  d: 'M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z',
  key: '1t7hil'
}]]);
var CalendarHeart$1 = CalendarHeart;

var CalendarMinus = createReactComponent('CalendarMinus', [['path', {
  d: 'M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8',
  key: '3spt84'
}], ['line', {
  x1: '16',
  y1: '2',
  x2: '16',
  y2: '6',
  key: '18saeg'
}], ['line', {
  x1: '8',
  y1: '2',
  x2: '8',
  y2: '6',
  key: '1u51jw'
}], ['line', {
  x1: '3',
  y1: '10',
  x2: '21',
  y2: '10',
  key: '6sq0yj'
}], ['line', {
  x1: '16',
  y1: '19',
  x2: '22',
  y2: '19',
  key: 'qkgpxo'
}]]);
var CalendarMinus$1 = CalendarMinus;

var CalendarOff = createReactComponent('CalendarOff', [['path', {
  d: 'M4.18 4.18A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.82-1.18',
  key: '1feomx'
}], ['path', {
  d: 'M21 15.5V6a2 2 0 0 0-2-2H9.5',
  key: 'yhw86o'
}], ['path', {
  d: 'M16 2v4',
  key: '4m81vk'
}], ['path', {
  d: 'M3 10h7',
  key: '1wap6i'
}], ['path', {
  d: 'M21 10h-5.5',
  key: 'quycpq'
}], ['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}]]);
var CalendarOff$1 = CalendarOff;

var CalendarPlus = createReactComponent('CalendarPlus', [['path', {
  d: 'M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8',
  key: '3spt84'
}], ['line', {
  x1: '16',
  y1: '2',
  x2: '16',
  y2: '6',
  key: '18saeg'
}], ['line', {
  x1: '8',
  y1: '2',
  x2: '8',
  y2: '6',
  key: '1u51jw'
}], ['line', {
  x1: '3',
  y1: '10',
  x2: '21',
  y2: '10',
  key: '6sq0yj'
}], ['line', {
  x1: '19',
  y1: '16',
  x2: '19',
  y2: '22',
  key: '537lsc'
}], ['line', {
  x1: '16',
  y1: '19',
  x2: '22',
  y2: '19',
  key: 'qkgpxo'
}]]);
var CalendarPlus$1 = CalendarPlus;

var CalendarRange = createReactComponent('CalendarRange', [['rect', {
  x: '3',
  y: '4',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: '1dtxiw'
}], ['line', {
  x1: '16',
  y1: '2',
  x2: '16',
  y2: '6',
  key: '18saeg'
}], ['line', {
  x1: '8',
  y1: '2',
  x2: '8',
  y2: '6',
  key: '1u51jw'
}], ['line', {
  x1: '3',
  y1: '10',
  x2: '21',
  y2: '10',
  key: '6sq0yj'
}], ['path', {
  d: 'M17 14h-6',
  key: 'bkmgh3'
}], ['path', {
  d: 'M13 18H7',
  key: 'bb0bb7'
}], ['path', {
  d: 'M7 14h.01',
  key: '1qa3f1'
}], ['path', {
  d: 'M17 18h.01',
  key: '1bdyru'
}]]);
var CalendarRange$1 = CalendarRange;

var CalendarSearch = createReactComponent('CalendarSearch', [['path', {
  d: 'M21 12V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h7.5',
  key: '18ncp8'
}], ['path', {
  d: 'M16 2v4',
  key: '4m81vk'
}], ['path', {
  d: 'M8 2v4',
  key: '1cmpym'
}], ['path', {
  d: 'M3 10h18',
  key: '8toen8'
}], ['path', {
  d: 'M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6v0Z',
  key: 'mgbru4'
}], ['path', {
  d: 'm22 22-1.5-1.5',
  key: '1x83k4'
}]]);
var CalendarSearch$1 = CalendarSearch;

var CalendarX2 = createReactComponent('CalendarX2', [['path', {
  d: 'M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8',
  key: '3spt84'
}], ['line', {
  x1: '16',
  y1: '2',
  x2: '16',
  y2: '6',
  key: '18saeg'
}], ['line', {
  x1: '8',
  y1: '2',
  x2: '8',
  y2: '6',
  key: '1u51jw'
}], ['line', {
  x1: '3',
  y1: '10',
  x2: '21',
  y2: '10',
  key: '6sq0yj'
}], ['line', {
  x1: '17',
  y1: '17',
  x2: '22',
  y2: '22',
  key: 'tvgkbv'
}], ['line', {
  x1: '17',
  y1: '22',
  x2: '22',
  y2: '17',
  key: '1l23f3'
}]]);
var CalendarX2$1 = CalendarX2;

var CalendarX = createReactComponent('CalendarX', [['rect', {
  x: '3',
  y: '4',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: '1dtxiw'
}], ['line', {
  x1: '16',
  y1: '2',
  x2: '16',
  y2: '6',
  key: '18saeg'
}], ['line', {
  x1: '8',
  y1: '2',
  x2: '8',
  y2: '6',
  key: '1u51jw'
}], ['line', {
  x1: '3',
  y1: '10',
  x2: '21',
  y2: '10',
  key: '6sq0yj'
}], ['line', {
  x1: '10',
  y1: '14',
  x2: '14',
  y2: '18',
  key: 'fs6roj'
}], ['line', {
  x1: '14',
  y1: '14',
  x2: '10',
  y2: '18',
  key: '1kdrv6'
}]]);
var CalendarX$1 = CalendarX;

var Calendar = createReactComponent('Calendar', [['rect', {
  x: '3',
  y: '4',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: '1dtxiw'
}], ['line', {
  x1: '16',
  y1: '2',
  x2: '16',
  y2: '6',
  key: '18saeg'
}], ['line', {
  x1: '8',
  y1: '2',
  x2: '8',
  y2: '6',
  key: '1u51jw'
}], ['line', {
  x1: '3',
  y1: '10',
  x2: '21',
  y2: '10',
  key: '6sq0yj'
}]]);
var Calendar$1 = Calendar;

var CameraOff = createReactComponent('CameraOff', [['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}], ['path', {
  d: 'M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16',
  key: 'qmtpty'
}], ['path', {
  d: 'M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5',
  key: '1ufyfc'
}], ['path', {
  d: 'M14.121 15.121A3 3 0 1 1 9.88 10.88',
  key: '11zox6'
}]]);
var CameraOff$1 = CameraOff;

var Camera = createReactComponent('Camera', [['path', {
  d: 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z',
  key: '1tc9qg'
}], ['circle', {
  cx: '12',
  cy: '13',
  r: '3',
  key: '1vg3eu'
}]]);
var Camera$1 = Camera;

var Car = createReactComponent('Car', [['path', {
  d: 'M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2',
  key: 'l5np60'
}], ['circle', {
  cx: '6.5',
  cy: '16.5',
  r: '2.5',
  key: 'ae40ju'
}], ['circle', {
  cx: '16.5',
  cy: '16.5',
  r: '2.5',
  key: '1smtlt'
}]]);
var Car$1 = Car;

var Carrot = createReactComponent('Carrot', [['path', {
  d: 'M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM8.64 14l-2.05-2.04M15.34 15l-2.46-2.46',
  key: 'rfqxbe'
}], ['path', {
  d: 'M22 9s-1.33-2-3.5-2C16.86 7 15 9 15 9s1.33 2 3.5 2S22 9 22 9z',
  key: '6b25w4'
}], ['path', {
  d: 'M15 2s-2 1.33-2 3.5S15 9 15 9s2-1.84 2-3.5C17 3.33 15 2 15 2z',
  key: 'fn65lo'
}]]);
var Carrot$1 = Carrot;

var Cast = createReactComponent('Cast', [['path', {
  d: 'M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6',
  key: '3zrzxg'
}], ['path', {
  d: 'M2 12a9 9 0 0 1 8 8',
  key: 'g6cvee'
}], ['path', {
  d: 'M2 16a5 5 0 0 1 4 4',
  key: '1y1dii'
}], ['line', {
  x1: '2',
  y1: '20',
  x2: '2.01',
  y2: '20',
  key: '1cypae'
}]]);
var Cast$1 = Cast;

var CheckCircle2 = createReactComponent('CheckCircle2', [['path', {
  d: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
  key: '14v8dr'
}], ['path', {
  d: 'm9 12 2 2 4-4',
  key: 'dzmm74'
}]]);
var CheckCircle2$1 = CheckCircle2;

var CheckCircle = createReactComponent('CheckCircle', [['path', {
  d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14',
  key: 'g774vq'
}], ['polyline', {
  points: '22 4 12 14.01 9 11.01',
  key: '6xbx8j'
}]]);
var CheckCircle$1 = CheckCircle;

var CheckSquare = createReactComponent('CheckSquare', [['polyline', {
  points: '9 11 12 14 22 4',
  key: '19ybtz'
}], ['path', {
  d: 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  key: '1jnkn4'
}]]);
var CheckSquare$1 = CheckSquare;

var Check = createReactComponent('Check', [['polyline', {
  points: '20 6 9 17 4 12',
  key: '10jjfj'
}]]);
var Check$1 = Check;

var ChefHat = createReactComponent('ChefHat', [['path', {
  d: 'M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z',
  key: 'z3ra2g'
}], ['line', {
  x1: '6',
  y1: '17',
  x2: '18',
  y2: '17',
  key: '130uxj'
}]]);
var ChefHat$1 = ChefHat;

var Cherry = createReactComponent('Cherry', [['path', {
  d: 'M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z',
  key: 'cvxqlc'
}], ['path', {
  d: 'M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z',
  key: '1ostrc'
}], ['path', {
  d: 'M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12',
  key: 'hqx58h'
}], ['path', {
  d: 'M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z',
  key: 'eykp1o'
}]]);
var Cherry$1 = Cherry;

var ChevronDown = createReactComponent('ChevronDown', [['polyline', {
  points: '6 9 12 15 18 9',
  key: '1do0m2'
}]]);
var ChevronDown$1 = ChevronDown;

var ChevronFirst = createReactComponent('ChevronFirst', [['polyline', {
  points: '17 18 11 12 17 6',
  key: '11nco2'
}], ['path', {
  d: 'M7 6v12',
  key: '1p53r6'
}]]);
var ChevronFirst$1 = ChevronFirst;

var ChevronLast = createReactComponent('ChevronLast', [['polyline', {
  points: '7 18 13 12 7 6',
  key: '1minw5'
}], ['path', {
  d: 'M17 6v12',
  key: '1o0aio'
}]]);
var ChevronLast$1 = ChevronLast;

var ChevronLeft = createReactComponent('ChevronLeft', [['polyline', {
  points: '15 18 9 12 15 6',
  key: 'kvxz59'
}]]);
var ChevronLeft$1 = ChevronLeft;

var ChevronRight = createReactComponent('ChevronRight', [['polyline', {
  points: '9 18 15 12 9 6',
  key: '1rtp27'
}]]);
var ChevronRight$1 = ChevronRight;

var ChevronUp = createReactComponent('ChevronUp', [['polyline', {
  points: '18 15 12 9 6 15',
  key: '1uugdp'
}]]);
var ChevronUp$1 = ChevronUp;

var ChevronsDownUp = createReactComponent('ChevronsDownUp', [['path', {
  d: 'm7 20 5-5 5 5',
  key: '13a0gw'
}], ['path', {
  d: 'm7 4 5 5 5-5',
  key: '1kwcof'
}]]);
var ChevronsDownUp$1 = ChevronsDownUp;

var ChevronsDown = createReactComponent('ChevronsDown', [['polyline', {
  points: '7 13 12 18 17 13',
  key: 'am1j83'
}], ['polyline', {
  points: '7 6 12 11 17 6',
  key: 'pjsmwq'
}]]);
var ChevronsDown$1 = ChevronsDown;

var ChevronsLeftRight = createReactComponent('ChevronsLeftRight', [['path', {
  d: 'm9 7-5 5 5 5',
  key: 'j5w590'
}], ['path', {
  d: 'm15 7 5 5-5 5',
  key: '1bl6da'
}]]);
var ChevronsLeftRight$1 = ChevronsLeftRight;

var ChevronsLeft = createReactComponent('ChevronsLeft', [['polyline', {
  points: '11 17 6 12 11 7',
  key: '1ueymj'
}], ['polyline', {
  points: '18 17 13 12 18 7',
  key: '18fy0m'
}]]);
var ChevronsLeft$1 = ChevronsLeft;

var ChevronsRightLeft = createReactComponent('ChevronsRightLeft', [['path', {
  d: 'm20 17-5-5 5-5',
  key: '30x0n2'
}], ['path', {
  d: 'm4 17 5-5-5-5',
  key: '16spf4'
}]]);
var ChevronsRightLeft$1 = ChevronsRightLeft;

var ChevronsRight = createReactComponent('ChevronsRight', [['polyline', {
  points: '13 17 18 12 13 7',
  key: 'oq0h83'
}], ['polyline', {
  points: '6 17 11 12 6 7',
  key: '3k300q'
}]]);
var ChevronsRight$1 = ChevronsRight;

var ChevronsUpDown = createReactComponent('ChevronsUpDown', [['path', {
  d: 'm7 15 5 5 5-5',
  key: '1hf1tw'
}], ['path', {
  d: 'm7 9 5-5 5 5',
  key: 'sgt6xg'
}]]);
var ChevronsUpDown$1 = ChevronsUpDown;

var ChevronsUp = createReactComponent('ChevronsUp', [['polyline', {
  points: '17 11 12 6 7 11',
  key: '1u9xa9'
}], ['polyline', {
  points: '17 18 12 13 7 18',
  key: '1fl4au'
}]]);
var ChevronsUp$1 = ChevronsUp;

var Chrome = createReactComponent('Chrome', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '4',
  key: '4exip2'
}], ['line', {
  x1: '21.17',
  y1: '8',
  x2: '12',
  y2: '8',
  key: '1a1nqa'
}], ['line', {
  x1: '3.95',
  y1: '6.06',
  x2: '8.54',
  y2: '14',
  key: 'irv2k6'
}], ['line', {
  x1: '10.88',
  y1: '21.94',
  x2: '15.46',
  y2: '14',
  key: 'fokf7t'
}]]);
var Chrome$1 = Chrome;

var CigaretteOff = createReactComponent('CigaretteOff', [['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}], ['path', {
  d: 'M12 12H2v4h14',
  key: '91gsaq'
}], ['path', {
  d: 'M22 12v4',
  key: '142cbu'
}], ['path', {
  d: 'M18 12h-.5',
  key: '12ymji'
}], ['path', {
  d: 'M7 12v4',
  key: 'jqww69'
}], ['path', {
  d: 'M18 8c0-2.5-2-2.5-2-5',
  key: '1il607'
}], ['path', {
  d: 'M22 8c0-2.5-2-2.5-2-5',
  key: '1gah44'
}]]);
var CigaretteOff$1 = CigaretteOff;

var Cigarette = createReactComponent('Cigarette', [['path', {
  d: 'M18 12H2v4h16',
  key: '2rt1hm'
}], ['path', {
  d: 'M22 12v4',
  key: '142cbu'
}], ['path', {
  d: 'M7 12v4',
  key: 'jqww69'
}], ['path', {
  d: 'M18 8c0-2.5-2-2.5-2-5',
  key: '1il607'
}], ['path', {
  d: 'M22 8c0-2.5-2-2.5-2-5',
  key: '1gah44'
}]]);
var Cigarette$1 = Cigarette;

var CircleDot = createReactComponent('CircleDot', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '1',
  key: '41hilf'
}]]);
var CircleDot$1 = CircleDot;

var CircleEllipsis = createReactComponent('CircleEllipsis', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['path', {
  d: 'M17 12h.01',
  key: '1m0b6t'
}], ['path', {
  d: 'M12 12h.01',
  key: '1mp3jc'
}], ['path', {
  d: 'M7 12h.01',
  key: 'eqddd0'
}]]);
var CircleEllipsis$1 = CircleEllipsis;

var CircleSlashed = createReactComponent('CircleSlashed', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['path', {
  d: 'M22 2 2 22',
  key: 'y4kqgn'
}]]);
var CircleSlashed$1 = CircleSlashed;

var Circle = createReactComponent('Circle', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}]]);
var Circle$1 = Circle;

var Citrus = createReactComponent('Citrus', [['path', {
  d: 'M5.51 18.49a12 12 0 0 0 16.12.78c.49-.41.49-1.15.03-1.6L6.34 2.33a1.08 1.08 0 0 0-1.6.03A12 12 0 0 0 5.5 18.5Z',
  key: 'cpj97m'
}], ['path', {
  d: 'M8.34 15.66a8 8 0 0 0 10.4.78c.54-.4.54-1.16.06-1.64L9.2 5.2c-.48-.48-1.25-.48-1.64.06a8 8 0 0 0 .78 10.4Z',
  key: 'vhgi9a'
}], ['path', {
  d: 'm14 10-5.5 5.5',
  key: '92pfem'
}], ['path', {
  d: 'M14 10v8',
  key: '3sxk0t'
}], ['path', {
  d: 'M14 10H6',
  key: '1aai03'
}]]);
var Citrus$1 = Citrus;

var Clapperboard = createReactComponent('Clapperboard', [['path', {
  d: 'M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4Z',
  key: '1hxvyx'
}], ['path', {
  d: 'm4 11-.88-2.87a2 2 0 0 1 1.33-2.5l11.48-3.5a2 2 0 0 1 2.5 1.32l.87 2.87L4 11.01Z',
  key: '1vz1k2'
}], ['path', {
  d: 'm6.6 4.99 3.38 4.2',
  key: '192ida'
}], ['path', {
  d: 'm11.86 3.38 3.38 4.2',
  key: 'hhucvz'
}]]);
var Clapperboard$1 = Clapperboard;

var ClipboardCheck = createReactComponent('ClipboardCheck', [['rect', {
  x: '8',
  y: '2',
  width: '8',
  height: '4',
  rx: '1',
  ry: '1',
  key: 'wz2j3u'
}], ['path', {
  d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
  key: '116196'
}], ['path', {
  d: 'm9 14 2 2 4-4',
  key: 'df797q'
}]]);
var ClipboardCheck$1 = ClipboardCheck;

var ClipboardCopy = createReactComponent('ClipboardCopy', [['rect', {
  x: '8',
  y: '2',
  width: '8',
  height: '4',
  rx: '1',
  ry: '1',
  key: 'wz2j3u'
}], ['path', {
  d: 'M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
  key: '4jdomd'
}], ['path', {
  d: 'M16 4h2a2 2 0 0 1 2 2v4',
  key: '3hqy98'
}], ['path', {
  d: 'M21 14H11',
  key: '1bme5i'
}], ['path', {
  d: 'm15 10-4 4 4 4',
  key: '5dvupr'
}]]);
var ClipboardCopy$1 = ClipboardCopy;

var ClipboardEdit = createReactComponent('ClipboardEdit', [['rect', {
  x: '8',
  y: '2',
  width: '8',
  height: '4',
  rx: '1',
  ry: '1',
  key: 'wz2j3u'
}], ['path', {
  d: 'M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z',
  key: '1rgxu8'
}], ['path', {
  d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5.5',
  key: 'cereej'
}], ['path', {
  d: 'M4 13.5V6a2 2 0 0 1 2-2h2',
  key: '5ua5vh'
}]]);
var ClipboardEdit$1 = ClipboardEdit;

var ClipboardList = createReactComponent('ClipboardList', [['rect', {
  x: '8',
  y: '2',
  width: '8',
  height: '4',
  rx: '1',
  ry: '1',
  key: 'wz2j3u'
}], ['path', {
  d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
  key: '116196'
}], ['path', {
  d: 'M12 11h4',
  key: '1jrz19'
}], ['path', {
  d: 'M12 16h4',
  key: 'n85exb'
}], ['path', {
  d: 'M8 11h.01',
  key: '1dfujw'
}], ['path', {
  d: 'M8 16h.01',
  key: '18s6g9'
}]]);
var ClipboardList$1 = ClipboardList;

var ClipboardSignature = createReactComponent('ClipboardSignature', [['rect', {
  x: '8',
  y: '2',
  width: '8',
  height: '4',
  rx: '1',
  ry: '1',
  key: 'wz2j3u'
}], ['path', {
  d: 'M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5',
  key: '1but9f'
}], ['path', {
  d: 'M16 4h2a2 2 0 0 1 1.73 1',
  key: '1p8n7l'
}], ['path', {
  d: 'M18.42 9.61a2.1 2.1 0 1 1 2.97 2.97L16.95 17 13 18l.99-3.95 4.43-4.44Z',
  key: 'johvi5'
}], ['path', {
  d: 'M8 18h1',
  key: '13wk12'
}]]);
var ClipboardSignature$1 = ClipboardSignature;

var ClipboardType = createReactComponent('ClipboardType', [['rect', {
  x: '8',
  y: '2',
  width: '8',
  height: '4',
  rx: '1',
  ry: '1',
  key: 'wz2j3u'
}], ['path', {
  d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
  key: '116196'
}], ['path', {
  d: 'M9 12v-1h6v1',
  key: 'iehl6m'
}], ['path', {
  d: 'M11 17h2',
  key: '12w5me'
}], ['path', {
  d: 'M12 11v6',
  key: '1bwqyc'
}]]);
var ClipboardType$1 = ClipboardType;

var ClipboardX = createReactComponent('ClipboardX', [['rect', {
  x: '8',
  y: '2',
  width: '8',
  height: '4',
  rx: '1',
  ry: '1',
  key: 'wz2j3u'
}], ['path', {
  d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
  key: '116196'
}], ['path', {
  d: 'm15 11-6 6',
  key: '1toa9n'
}], ['path', {
  d: 'm9 11 6 6',
  key: 'wlibny'
}]]);
var ClipboardX$1 = ClipboardX;

var Clipboard = createReactComponent('Clipboard', [['rect', {
  x: '8',
  y: '2',
  width: '8',
  height: '4',
  rx: '1',
  ry: '1',
  key: 'wz2j3u'
}], ['path', {
  d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
  key: '116196'
}]]);
var Clipboard$1 = Clipboard;

var Clock1 = createReactComponent('Clock1', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '12 6 12 12 14.5 8',
  key: '12zbmj'
}]]);
var Clock1$1 = Clock1;

var Clock10 = createReactComponent('Clock10', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '12 6 12 12 8 10',
  key: 'atfzqc'
}]]);
var Clock10$1 = Clock10;

var Clock11 = createReactComponent('Clock11', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '12 6 12 12 9.5 8',
  key: 'l5bg6f'
}]]);
var Clock11$1 = Clock11;

var Clock12 = createReactComponent('Clock12', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '12 6 12 12',
  key: '1fub01'
}]]);
var Clock12$1 = Clock12;

var Clock2 = createReactComponent('Clock2', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '12 6 12 12 16 10',
  key: '1g230d'
}]]);
var Clock2$1 = Clock2;

var Clock3 = createReactComponent('Clock3', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '12 6 12 12 16.5 12',
  key: '1aq6pp'
}]]);
var Clock3$1 = Clock3;

var Clock4 = createReactComponent('Clock4', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '12 6 12 12 16 14',
  key: '68esgv'
}]]);
var Clock4$1 = Clock4;

var Clock5 = createReactComponent('Clock5', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '12 6 12 12 14.5 16',
  key: '1pcbox'
}]]);
var Clock5$1 = Clock5;

var Clock6 = createReactComponent('Clock6', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '12 6 12 12 12 16.5',
  key: 'hb2qv6'
}]]);
var Clock6$1 = Clock6;

var Clock7 = createReactComponent('Clock7', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '12 6 12 12 9.5 16',
  key: 'ka3394'
}]]);
var Clock7$1 = Clock7;

var Clock8 = createReactComponent('Clock8', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '12 6 12 12 8 14',
  key: 'tmc9b4'
}]]);
var Clock8$1 = Clock8;

var Clock9 = createReactComponent('Clock9', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '12 6 12 12 7.5 12',
  key: '1k60p0'
}]]);
var Clock9$1 = Clock9;

var Clock = createReactComponent('Clock', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polyline', {
  points: '12 6 12 12 16 14',
  key: '68esgv'
}]]);
var Clock$1 = Clock;

var CloudCog = createReactComponent('CloudCog', [['path', {
  d: 'M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9',
  key: '19hoja'
}], ['circle', {
  cx: '12',
  cy: '17',
  r: '3',
  key: '1spfwm'
}], ['path', {
  d: 'M12 13v1',
  key: '176q98'
}], ['path', {
  d: 'M12 20v1',
  key: '1wcdkc'
}], ['path', {
  d: 'M16 17h-1',
  key: 'y560le'
}], ['path', {
  d: 'M9 17H8',
  key: '1lfe9z'
}], ['path', {
  d: 'm15 14-.88.88',
  key: '12ytk1'
}], ['path', {
  d: 'M9.88 19.12 9 20',
  key: '1kmb4r'
}], ['path', {
  d: 'm15 20-.88-.88',
  key: '1ipjcf'
}], ['path', {
  d: 'M9.88 14.88 9 14',
  key: 'c4uok7'
}]]);
var CloudCog$1 = CloudCog;

var CloudDrizzle = createReactComponent('CloudDrizzle', [['path', {
  d: 'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242',
  key: '1pljnt'
}], ['path', {
  d: 'M8 19v1',
  key: '1dk2by'
}], ['path', {
  d: 'M8 14v1',
  key: '84yxot'
}], ['path', {
  d: 'M16 19v1',
  key: 'v220m7'
}], ['path', {
  d: 'M16 14v1',
  key: 'g12gj6'
}], ['path', {
  d: 'M12 21v1',
  key: 'q8vafk'
}], ['path', {
  d: 'M12 16v1',
  key: '1mx6rx'
}]]);
var CloudDrizzle$1 = CloudDrizzle;

var CloudFog = createReactComponent('CloudFog', [['path', {
  d: 'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242',
  key: '1pljnt'
}], ['path', {
  d: 'M16 17H7',
  key: 'pygtm1'
}], ['path', {
  d: 'M17 21H9',
  key: '1u2q02'
}]]);
var CloudFog$1 = CloudFog;

var CloudHail = createReactComponent('CloudHail', [['path', {
  d: 'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242',
  key: '1pljnt'
}], ['path', {
  d: 'M16 14v2',
  key: 'a1is7l'
}], ['path', {
  d: 'M8 14v2',
  key: '1e9m6t'
}], ['path', {
  d: 'M16 20h.01',
  key: 'xwek51'
}], ['path', {
  d: 'M8 20h.01',
  key: '1vjney'
}], ['path', {
  d: 'M12 16v2',
  key: 'z66u1j'
}], ['path', {
  d: 'M12 22h.01',
  key: '1urd7a'
}]]);
var CloudHail$1 = CloudHail;

var CloudLightning = createReactComponent('CloudLightning', [['path', {
  d: 'M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973',
  key: '1cez44'
}], ['path', {
  d: 'm13 12-3 5h4l-3 5',
  key: '1t22er'
}]]);
var CloudLightning$1 = CloudLightning;

var CloudMoonRain = createReactComponent('CloudMoonRain', [['path', {
  d: 'M10.083 9A6.002 6.002 0 0 1 16 4a4.243 4.243 0 0 0 6 6c0 2.22-1.206 4.16-3 5.197',
  key: 'u82z8m'
}], ['path', {
  d: 'M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24',
  key: '1qmrp3'
}], ['path', {
  d: 'M11 20v2',
  key: '174qtz'
}], ['path', {
  d: 'M7 19v2',
  key: '12npes'
}]]);
var CloudMoonRain$1 = CloudMoonRain;

var CloudMoon = createReactComponent('CloudMoon', [['path', {
  d: 'M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z',
  key: 's09mg5'
}], ['path', {
  d: 'M10.083 9A6.002 6.002 0 0 1 16 4a4.243 4.243 0 0 0 6 6c0 2.22-1.206 4.16-3 5.197',
  key: 'u82z8m'
}]]);
var CloudMoon$1 = CloudMoon;

var CloudOff = createReactComponent('CloudOff', [['path', {
  d: 'm2 2 20 20',
  key: '1ooewy'
}], ['path', {
  d: 'M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193',
  key: 'yfwify'
}], ['path', {
  d: 'M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07',
  key: 'jlfiyv'
}]]);
var CloudOff$1 = CloudOff;

var CloudRainWind = createReactComponent('CloudRainWind', [['path', {
  d: 'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242',
  key: '1pljnt'
}], ['path', {
  d: 'm9.2 22 3-7',
  key: 'sb5f6j'
}], ['path', {
  d: 'm9 13-3 7',
  key: '500co5'
}], ['path', {
  d: 'm17 13-3 7',
  key: '8t2fiy'
}]]);
var CloudRainWind$1 = CloudRainWind;

var CloudRain = createReactComponent('CloudRain', [['path', {
  d: 'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242',
  key: '1pljnt'
}], ['path', {
  d: 'M16 14v6',
  key: '1j4efv'
}], ['path', {
  d: 'M8 14v6',
  key: '17c4r9'
}], ['path', {
  d: 'M12 16v6',
  key: 'c8a4gj'
}]]);
var CloudRain$1 = CloudRain;

var CloudSnow = createReactComponent('CloudSnow', [['path', {
  d: 'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242',
  key: '1pljnt'
}], ['path', {
  d: 'M8 15h.01',
  key: 'a7atzg'
}], ['path', {
  d: 'M8 19h.01',
  key: 'puxtts'
}], ['path', {
  d: 'M12 17h.01',
  key: 'p32p05'
}], ['path', {
  d: 'M12 21h.01',
  key: 'h35vbk'
}], ['path', {
  d: 'M16 15h.01',
  key: 'rnfrdf'
}], ['path', {
  d: 'M16 19h.01',
  key: '1vcnzz'
}]]);
var CloudSnow$1 = CloudSnow;

var CloudSunRain = createReactComponent('CloudSunRain', [['path', {
  d: 'M12 2v2',
  key: 'tus03m'
}], ['path', {
  d: 'm4.93 4.93 1.41 1.41',
  key: '149t6j'
}], ['path', {
  d: 'M20 12h2',
  key: '1q8mjw'
}], ['path', {
  d: 'm19.07 4.93-1.41 1.41',
  key: '1shlcs'
}], ['path', {
  d: 'M15.947 12.65a4 4 0 0 0-5.925-4.128',
  key: 'dpwdj0'
}], ['path', {
  d: 'M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24',
  key: '1qmrp3'
}], ['path', {
  d: 'M11 20v2',
  key: '174qtz'
}], ['path', {
  d: 'M7 19v2',
  key: '12npes'
}]]);
var CloudSunRain$1 = CloudSunRain;

var CloudSun = createReactComponent('CloudSun', [['path', {
  d: 'M12 2v2',
  key: 'tus03m'
}], ['path', {
  d: 'm4.93 4.93 1.41 1.41',
  key: '149t6j'
}], ['path', {
  d: 'M20 12h2',
  key: '1q8mjw'
}], ['path', {
  d: 'm19.07 4.93-1.41 1.41',
  key: '1shlcs'
}], ['path', {
  d: 'M15.947 12.65a4 4 0 0 0-5.925-4.128',
  key: 'dpwdj0'
}], ['path', {
  d: 'M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z',
  key: 's09mg5'
}]]);
var CloudSun$1 = CloudSun;

var Cloud = createReactComponent('Cloud', [['path', {
  d: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z',
  key: 'p7xjir'
}]]);
var Cloud$1 = Cloud;

var Cloudy = createReactComponent('Cloudy', [['path', {
  d: 'M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z',
  key: 'gqqjvc'
}], ['path', {
  d: 'M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5',
  key: '1p2s76'
}]]);
var Cloudy$1 = Cloudy;

var Clover = createReactComponent('Clover', [['path', {
  d: 'M16.2 3.8a2.7 2.7 0 0 0-3.81 0l-.4.38-.4-.4a2.7 2.7 0 0 0-3.82 0C6.73 4.85 6.67 6.64 8 8l4 4 4-4c1.33-1.36 1.27-3.15.2-4.2z',
  key: '1gxwox'
}], ['path', {
  d: 'M8 8c-1.36-1.33-3.15-1.27-4.2-.2a2.7 2.7 0 0 0 0 3.81l.38.4-.4.4a2.7 2.7 0 0 0 0 3.82C4.85 17.27 6.64 17.33 8 16',
  key: 'il7z7z'
}], ['path', {
  d: 'M16 16c1.36 1.33 3.15 1.27 4.2.2a2.7 2.7 0 0 0 0-3.81l-.38-.4.4-.4a2.7 2.7 0 0 0 0-3.82C19.15 6.73 17.36 6.67 16 8',
  key: '15bpx2'
}], ['path', {
  d: 'M7.8 20.2a2.7 2.7 0 0 0 3.81 0l.4-.38.4.4a2.7 2.7 0 0 0 3.82 0c1.06-1.06 1.12-2.85-.21-4.21l-4-4-4 4c-1.33 1.36-1.27 3.15-.2 4.2z',
  key: 'v9mug8'
}], ['path', {
  d: 'm7 17-5 5',
  key: '1py3mz'
}]]);
var Clover$1 = Clover;

var Code2 = createReactComponent('Code2', [['path', {
  d: 'm18 16 4-4-4-4',
  key: '1inbqp'
}], ['path', {
  d: 'm6 8-4 4 4 4',
  key: '15zrgr'
}], ['path', {
  d: 'm14.5 4-5 16',
  key: 'e7oirm'
}]]);
var Code2$1 = Code2;

var Code = createReactComponent('Code', [['polyline', {
  points: '16 18 22 12 16 6',
  key: 'z7tu5w'
}], ['polyline', {
  points: '8 6 2 12 8 18',
  key: '1eg1df'
}]]);
var Code$1 = Code;

var Codepen = createReactComponent('Codepen', [['polygon', {
  points: '12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2',
  key: 'srzb37'
}], ['line', {
  x1: '12',
  y1: '22',
  x2: '12',
  y2: '15.5',
  key: 'zsefro'
}], ['polyline', {
  points: '22 8.5 12 15.5 2 8.5',
  key: 'ajlxae'
}], ['polyline', {
  points: '2 15.5 12 8.5 22 15.5',
  key: 'susrui'
}], ['line', {
  x1: '12',
  y1: '2',
  x2: '12',
  y2: '8.5',
  key: 'zll5ve'
}]]);
var Codepen$1 = Codepen;

var Codesandbox = createReactComponent('Codesandbox', [['path', {
  d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  key: 'yt0hxn'
}], ['polyline', {
  points: '7.5 4.21 12 6.81 16.5 4.21',
  key: 'fabo96'
}], ['polyline', {
  points: '7.5 19.79 7.5 14.6 3 12',
  key: 'z377f1'
}], ['polyline', {
  points: '21 12 16.5 14.6 16.5 19.79',
  key: '9nrev1'
}], ['polyline', {
  points: '3.27 6.96 12 12.01 20.73 6.96',
  key: '1180pa'
}], ['line', {
  x1: '12',
  y1: '22.08',
  x2: '12',
  y2: '12',
  key: '10a5a7'
}]]);
var Codesandbox$1 = Codesandbox;

var Coffee = createReactComponent('Coffee', [['path', {
  d: 'M17 8h1a4 4 0 1 1 0 8h-1',
  key: 'jx4kbh'
}], ['path', {
  d: 'M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z',
  key: '1bxrl0'
}], ['line', {
  x1: '6',
  y1: '2',
  x2: '6',
  y2: '4',
  key: '1p57d3'
}], ['line', {
  x1: '10',
  y1: '2',
  x2: '10',
  y2: '4',
  key: 'xb2gh9'
}], ['line', {
  x1: '14',
  y1: '2',
  x2: '14',
  y2: '4',
  key: 'gpi44t'
}]]);
var Coffee$1 = Coffee;

var Cog = createReactComponent('Cog', [['path', {
  d: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
  key: 'sobvz5'
}], ['path', {
  d: 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  key: '11i496'
}], ['path', {
  d: 'M12 2v2',
  key: 'tus03m'
}], ['path', {
  d: 'M12 22v-2',
  key: '1osdcq'
}], ['path', {
  d: 'm17 20.66-1-1.73',
  key: 'eq3orb'
}], ['path', {
  d: 'M11 10.27 7 3.34',
  key: '16pf9h'
}], ['path', {
  d: 'm20.66 17-1.73-1',
  key: 'sg0v6f'
}], ['path', {
  d: 'm3.34 7 1.73 1',
  key: '1ulond'
}], ['path', {
  d: 'M14 12h8',
  key: '4f43i9'
}], ['path', {
  d: 'M2 12h2',
  key: '1t8f8n'
}], ['path', {
  d: 'm20.66 7-1.73 1',
  key: '1ow05n'
}], ['path', {
  d: 'm3.34 17 1.73-1',
  key: 'nuk764'
}], ['path', {
  d: 'm17 3.34-1 1.73',
  key: '2wel8s'
}], ['path', {
  d: 'm11 13.73-4 6.93',
  key: '794ttg'
}]]);
var Cog$1 = Cog;

var Coins = createReactComponent('Coins', [['circle', {
  cx: '8',
  cy: '8',
  r: '6',
  key: '3yglwk'
}], ['path', {
  d: 'M18.09 10.37A6 6 0 1 1 10.34 18',
  key: 't5s6rm'
}], ['path', {
  d: 'M7 6h1v4',
  key: '1obek4'
}], ['path', {
  d: 'm16.71 13.88.7.71-2.82 2.82',
  key: '1rbuyh'
}]]);
var Coins$1 = Coins;

var Columns = createReactComponent('Columns', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['line', {
  x1: '12',
  y1: '3',
  x2: '12',
  y2: '21',
  key: 'essbwb'
}]]);
var Columns$1 = Columns;

var Command = createReactComponent('Command', [['path', {
  d: 'M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z',
  key: 'uqkaba'
}]]);
var Command$1 = Command;

var Compass = createReactComponent('Compass', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polygon', {
  points: '16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76',
  key: 'm9r19z'
}]]);
var Compass$1 = Compass;

var Component = createReactComponent('Component', [['path', {
  d: 'M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z',
  key: '1kciei'
}], ['path', {
  d: 'm12 2 3.5 3.5L12 9 8.5 5.5 12 2Z',
  key: '1ome0g'
}], ['path', {
  d: 'M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z',
  key: 'vbupec'
}], ['path', {
  d: 'm12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z',
  key: '16csic'
}]]);
var Component$1 = Component;

var ConciergeBell = createReactComponent('ConciergeBell', [['path', {
  d: 'M2 18a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2H2v-2Z',
  key: '1co3i8'
}], ['path', {
  d: 'M20 16a8 8 0 1 0-16 0',
  key: '1pa543'
}], ['path', {
  d: 'M12 4v4',
  key: '1bq03y'
}], ['path', {
  d: 'M10 4h4',
  key: '1xpv9s'
}]]);
var ConciergeBell$1 = ConciergeBell;

var Contact = createReactComponent('Contact', [['path', {
  d: 'M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2',
  key: '1mghuy'
}], ['rect', {
  x: '3',
  y: '4',
  width: '18',
  height: '18',
  rx: '2',
  key: '12vinp'
}], ['circle', {
  cx: '12',
  cy: '10',
  r: '2',
  key: '1yojzk'
}], ['line', {
  x1: '8',
  y1: '2',
  x2: '8',
  y2: '4',
  key: '1r8a5u'
}], ['line', {
  x1: '16',
  y1: '2',
  x2: '16',
  y2: '4',
  key: 'tp0trh'
}]]);
var Contact$1 = Contact;

var Contrast = createReactComponent('Contrast', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['path', {
  d: 'M12 18a6 6 0 0 0 0-12v12z',
  key: 'j4l70d'
}]]);
var Contrast$1 = Contrast;

var Cookie = createReactComponent('Cookie', [['path', {
  d: 'M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5',
  key: 'laymnq'
}], ['path', {
  d: 'M8.5 8.5v.01',
  key: 'ue8clq'
}], ['path', {
  d: 'M16 15.5v.01',
  key: '14dtrp'
}], ['path', {
  d: 'M12 12v.01',
  key: 'u5ubse'
}], ['path', {
  d: 'M11 17v.01',
  key: '1hyl5a'
}], ['path', {
  d: 'M7 14v.01',
  key: 'uct60s'
}]]);
var Cookie$1 = Cookie;

var Copy = createReactComponent('Copy', [['rect', {
  x: '9',
  y: '9',
  width: '13',
  height: '13',
  rx: '2',
  ry: '2',
  key: '1ma1o8'
}], ['path', {
  d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
  key: 'pklvoz'
}]]);
var Copy$1 = Copy;

var Copyleft = createReactComponent('Copyleft', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['path', {
  d: 'M9 9.35a4 4 0 1 1 0 5.3',
  key: 'p8fkhi'
}]]);
var Copyleft$1 = Copyleft;

var Copyright = createReactComponent('Copyright', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['path', {
  d: 'M15 9.354a4 4 0 1 0 0 5.292',
  key: '8xfhbo'
}]]);
var Copyright$1 = Copyright;

var CornerDownLeft = createReactComponent('CornerDownLeft', [['polyline', {
  points: '9 10 4 15 9 20',
  key: 'r3jprv'
}], ['path', {
  d: 'M20 4v7a4 4 0 0 1-4 4H4',
  key: '6o5b7l'
}]]);
var CornerDownLeft$1 = CornerDownLeft;

var CornerDownRight = createReactComponent('CornerDownRight', [['polyline', {
  points: '15 10 20 15 15 20',
  key: '1q7qjw'
}], ['path', {
  d: 'M4 4v7a4 4 0 0 0 4 4h12',
  key: 'z08zvw'
}]]);
var CornerDownRight$1 = CornerDownRight;

var CornerLeftDown = createReactComponent('CornerLeftDown', [['polyline', {
  points: '14 15 9 20 4 15',
  key: 'nkc4i'
}], ['path', {
  d: 'M20 4h-7a4 4 0 0 0-4 4v12',
  key: 'nbpdq2'
}]]);
var CornerLeftDown$1 = CornerLeftDown;

var CornerLeftUp = createReactComponent('CornerLeftUp', [['polyline', {
  points: '14 9 9 4 4 9',
  key: 'm9oyvo'
}], ['path', {
  d: 'M20 20h-7a4 4 0 0 1-4-4V4',
  key: '1blwi3'
}]]);
var CornerLeftUp$1 = CornerLeftUp;

var CornerRightDown = createReactComponent('CornerRightDown', [['polyline', {
  points: '10 15 15 20 20 15',
  key: 'axus6l'
}], ['path', {
  d: 'M4 4h7a4 4 0 0 1 4 4v12',
  key: 'wcbgct'
}]]);
var CornerRightDown$1 = CornerRightDown;

var CornerRightUp = createReactComponent('CornerRightUp', [['polyline', {
  points: '10 9 15 4 20 9',
  key: '1lr6px'
}], ['path', {
  d: 'M4 20h7a4 4 0 0 0 4-4V4',
  key: '1plgdj'
}]]);
var CornerRightUp$1 = CornerRightUp;

var CornerUpLeft = createReactComponent('CornerUpLeft', [['polyline', {
  points: '9 14 4 9 9 4',
  key: '881910'
}], ['path', {
  d: 'M20 20v-7a4 4 0 0 0-4-4H4',
  key: '1nkjon'
}]]);
var CornerUpLeft$1 = CornerUpLeft;

var CornerUpRight = createReactComponent('CornerUpRight', [['polyline', {
  points: '15 14 20 9 15 4',
  key: '1tbx3s'
}], ['path', {
  d: 'M4 20v-7a4 4 0 0 1 4-4h12',
  key: '1lu4f8'
}]]);
var CornerUpRight$1 = CornerUpRight;

var Cpu = createReactComponent('Cpu', [['rect', {
  x: '4',
  y: '4',
  width: '16',
  height: '16',
  rx: '2',
  ry: '2',
  key: '19czt8'
}], ['rect', {
  x: '9',
  y: '9',
  width: '6',
  height: '6',
  key: 'o3kz5p'
}], ['line', {
  x1: '9',
  y1: '2',
  x2: '9',
  y2: '4',
  key: '1tcqwn'
}], ['line', {
  x1: '15',
  y1: '2',
  x2: '15',
  y2: '4',
  key: '1yvlak'
}], ['line', {
  x1: '9',
  y1: '21',
  x2: '9',
  y2: '22',
  key: 'tuhu08'
}], ['line', {
  x1: '15',
  y1: '20',
  x2: '15',
  y2: '22',
  key: '1o5cyu'
}], ['line', {
  x1: '20',
  y1: '9',
  x2: '22',
  y2: '9',
  key: 'b8rlm1'
}], ['line', {
  x1: '20',
  y1: '14',
  x2: '22',
  y2: '14',
  key: '1mk8c1'
}], ['line', {
  x1: '2',
  y1: '9',
  x2: '4',
  y2: '9',
  key: 'bt7uvh'
}], ['line', {
  x1: '2',
  y1: '14',
  x2: '4',
  y2: '14',
  key: 'hp71sd'
}]]);
var Cpu$1 = Cpu;

var CreditCard = createReactComponent('CreditCard', [['rect', {
  x: '2',
  y: '5',
  width: '20',
  height: '14',
  rx: '2',
  key: 'qneu4z'
}], ['line', {
  x1: '2',
  y1: '10',
  x2: '22',
  y2: '10',
  key: '1ytoly'
}]]);
var CreditCard$1 = CreditCard;

var Croissant = createReactComponent('Croissant', [['path', {
  d: 'm4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z',
  key: '1ozxlb'
}], ['path', {
  d: 'm10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83',
  key: 'ffuyb5'
}], ['path', {
  d: 'M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4',
  key: 'osnpzi'
}], ['path', {
  d: 'm14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2',
  key: '1vubaw'
}], ['path', {
  d: 'M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5',
  key: 'wxr772'
}]]);
var Croissant$1 = Croissant;

var Crop = createReactComponent('Crop', [['path', {
  d: 'M6 2v14a2 2 0 0 0 2 2h14',
  key: 'ron5a4'
}], ['path', {
  d: 'M18 22V8a2 2 0 0 0-2-2H2',
  key: '7s9ehn'
}]]);
var Crop$1 = Crop;

var Cross = createReactComponent('Cross', [['path', {
  d: 'M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z',
  key: '1t5g7j'
}]]);
var Cross$1 = Cross;

var Crosshair = createReactComponent('Crosshair', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['line', {
  x1: '22',
  y1: '12',
  x2: '18',
  y2: '12',
  key: 'yivkn6'
}], ['line', {
  x1: '6',
  y1: '12',
  x2: '2',
  y2: '12',
  key: 'hlzxjj'
}], ['line', {
  x1: '12',
  y1: '6',
  x2: '12',
  y2: '2',
  key: '1s1957'
}], ['line', {
  x1: '12',
  y1: '22',
  x2: '12',
  y2: '18',
  key: '2x08zm'
}]]);
var Crosshair$1 = Crosshair;

var Crown = createReactComponent('Crown', [['path', {
  d: 'm2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14',
  key: 'zkxr6b'
}]]);
var Crown$1 = Crown;

var CupSoda = createReactComponent('CupSoda', [['path', {
  d: 'm6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8',
  key: '8166m8'
}], ['path', {
  d: 'M5 8h14',
  key: 'pcz4l3'
}], ['path', {
  d: 'M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0',
  key: 'yjz344'
}], ['path', {
  d: 'm12 8 1-6h2',
  key: '3ybfa4'
}]]);
var CupSoda$1 = CupSoda;

var CurlyBraces = createReactComponent('CurlyBraces', [['path', {
  d: 'M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1',
  key: 'ezmyqa'
}], ['path', {
  d: 'M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1',
  key: 'e1hn23'
}]]);
var CurlyBraces$1 = CurlyBraces;

var Currency = createReactComponent('Currency', [['circle', {
  cx: '12',
  cy: '12',
  r: '8',
  key: '46899m'
}], ['line', {
  x1: '3',
  y1: '3',
  x2: '6',
  y2: '6',
  key: 'zkqcdn'
}], ['line', {
  x1: '21',
  y1: '3',
  x2: '18',
  y2: '6',
  key: 'n7spic'
}], ['line', {
  x1: '3',
  y1: '21',
  x2: '6',
  y2: '18',
  key: '7xq9ok'
}], ['line', {
  x1: '21',
  y1: '21',
  x2: '18',
  y2: '18',
  key: 'mzvtez'
}]]);
var Currency$1 = Currency;

var Database = createReactComponent('Database', [['ellipse', {
  cx: '12',
  cy: '5',
  rx: '9',
  ry: '3',
  key: 'msslwz'
}], ['path', {
  d: 'M21 12c0 1.66-4 3-9 3s-9-1.34-9-3',
  key: 'pw5pse'
}], ['path', {
  d: 'M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5',
  key: '7dtpbs'
}]]);
var Database$1 = Database;

var Delete = createReactComponent('Delete', [['path', {
  d: 'M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z',
  key: '1oy587'
}], ['line', {
  x1: '18',
  y1: '9',
  x2: '12',
  y2: '15',
  key: '1328vg'
}], ['line', {
  x1: '12',
  y1: '9',
  x2: '18',
  y2: '15',
  key: '6xbiik'
}]]);
var Delete$1 = Delete;

var Diamond = createReactComponent('Diamond', [['rect', {
  x: '12',
  y: '1',
  width: '15.56',
  height: '15.56',
  rx: '2.41',
  transform: 'rotate(45 12 1)',
  key: 'dtb0qj'
}]]);
var Diamond$1 = Diamond;

var Dice1 = createReactComponent('Dice1', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['path', {
  d: 'M12 12h.01',
  key: '1mp3jc'
}]]);
var Dice1$1 = Dice1;

var Dice2 = createReactComponent('Dice2', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['path', {
  d: 'M15 9h.01',
  key: 'x1ddxp'
}], ['path', {
  d: 'M9 15h.01',
  key: 'fzyn71'
}]]);
var Dice2$1 = Dice2;

var Dice3 = createReactComponent('Dice3', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['path', {
  d: 'M16 8h.01',
  key: 'cr5u4v'
}], ['path', {
  d: 'M12 12h.01',
  key: '1mp3jc'
}], ['path', {
  d: 'M8 16h.01',
  key: '18s6g9'
}]]);
var Dice3$1 = Dice3;

var Dice4 = createReactComponent('Dice4', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['path', {
  d: 'M16 8h.01',
  key: 'cr5u4v'
}], ['path', {
  d: 'M8 8h.01',
  key: '1e4136'
}], ['path', {
  d: 'M8 16h.01',
  key: '18s6g9'
}], ['path', {
  d: 'M16 16h.01',
  key: '1f9h7w'
}]]);
var Dice4$1 = Dice4;

var Dice5 = createReactComponent('Dice5', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['path', {
  d: 'M16 8h.01',
  key: 'cr5u4v'
}], ['path', {
  d: 'M8 8h.01',
  key: '1e4136'
}], ['path', {
  d: 'M8 16h.01',
  key: '18s6g9'
}], ['path', {
  d: 'M16 16h.01',
  key: '1f9h7w'
}], ['path', {
  d: 'M12 12h.01',
  key: '1mp3jc'
}]]);
var Dice5$1 = Dice5;

var Dice6 = createReactComponent('Dice6', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['path', {
  d: 'M16 8h.01',
  key: 'cr5u4v'
}], ['path', {
  d: 'M16 12h.01',
  key: '1l6xoz'
}], ['path', {
  d: 'M16 16h.01',
  key: '1f9h7w'
}], ['path', {
  d: 'M8 8h.01',
  key: '1e4136'
}], ['path', {
  d: 'M8 12h.01',
  key: 'czm47f'
}], ['path', {
  d: 'M8 16h.01',
  key: '18s6g9'
}]]);
var Dice6$1 = Dice6;

var Dices = createReactComponent('Dices', [['rect', {
  x: '2',
  y: '10',
  width: '12',
  height: '12',
  rx: '2',
  ry: '2',
  key: '73wp2n'
}], ['path', {
  d: 'm17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6',
  key: '1o487t'
}], ['path', {
  d: 'M6 18h.01',
  key: 'uhywen'
}], ['path', {
  d: 'M10 14h.01',
  key: 'ssrbsk'
}], ['path', {
  d: 'M15 6h.01',
  key: 'cblpky'
}], ['path', {
  d: 'M18 9h.01',
  key: '2061c0'
}]]);
var Dices$1 = Dices;

var Diff = createReactComponent('Diff', [['path', {
  d: 'M12 3v14',
  key: '7cf3v8'
}], ['path', {
  d: 'M5 10h14',
  key: 'elsbfy'
}], ['path', {
  d: 'M5 21h14',
  key: '11awu3'
}]]);
var Diff$1 = Diff;

var Disc = createReactComponent('Disc', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '3',
  key: '1v7zrd'
}]]);
var Disc$1 = Disc;

var DivideCircle = createReactComponent('DivideCircle', [['line', {
  x1: '8',
  y1: '12',
  x2: '16',
  y2: '12',
  key: '1myapg'
}], ['line', {
  x1: '12',
  y1: '16',
  x2: '12',
  y2: '16',
  key: '4v5xkb'
}], ['line', {
  x1: '12',
  y1: '8',
  x2: '12',
  y2: '8',
  key: '1vrb7x'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}]]);
var DivideCircle$1 = DivideCircle;

var DivideSquare = createReactComponent('DivideSquare', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['line', {
  x1: '8',
  y1: '12',
  x2: '16',
  y2: '12',
  key: '1myapg'
}], ['line', {
  x1: '12',
  y1: '16',
  x2: '12',
  y2: '16',
  key: '4v5xkb'
}], ['line', {
  x1: '12',
  y1: '8',
  x2: '12',
  y2: '8',
  key: '1vrb7x'
}]]);
var DivideSquare$1 = DivideSquare;

var Divide = createReactComponent('Divide', [['circle', {
  cx: '12',
  cy: '6',
  r: '1',
  key: '1bh7o1'
}], ['line', {
  x1: '5',
  y1: '12',
  x2: '19',
  y2: '12',
  key: '1smlys'
}], ['circle', {
  cx: '12',
  cy: '18',
  r: '1',
  key: 'lqb9t5'
}]]);
var Divide$1 = Divide;

var DollarSign = createReactComponent('DollarSign', [['line', {
  x1: '12',
  y1: '2',
  x2: '12',
  y2: '22',
  key: '1k6o5o'
}], ['path', {
  d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  key: '1b0p4s'
}]]);
var DollarSign$1 = DollarSign;

var DownloadCloud = createReactComponent('DownloadCloud', [['path', {
  d: 'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242',
  key: '1pljnt'
}], ['path', {
  d: 'M12 12v9',
  key: '192myk'
}], ['path', {
  d: 'm8 17 4 4 4-4',
  key: '1ul180'
}]]);
var DownloadCloud$1 = DownloadCloud;

var Download = createReactComponent('Download', [['path', {
  d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
  key: 'ih7n3h'
}], ['polyline', {
  points: '7 10 12 15 17 10',
  key: '2ggqvy'
}], ['line', {
  x1: '12',
  y1: '15',
  x2: '12',
  y2: '3',
  key: 'nqo27w'
}]]);
var Download$1 = Download;

var Dribbble = createReactComponent('Dribbble', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['path', {
  d: 'M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94',
  key: 'hpej1'
}], ['path', {
  d: 'M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32',
  key: '1tr44o'
}], ['path', {
  d: 'M8.56 2.75c4.37 6 6 9.42 8 17.72',
  key: 'kbh691'
}]]);
var Dribbble$1 = Dribbble;

var Droplet = createReactComponent('Droplet', [['path', {
  d: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z',
  key: 'c7niix'
}]]);
var Droplet$1 = Droplet;

var Droplets = createReactComponent('Droplets', [['path', {
  d: 'M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z',
  key: '1ptgy4'
}], ['path', {
  d: 'M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97',
  key: '1sl1rz'
}]]);
var Droplets$1 = Droplets;

var Drumstick = createReactComponent('Drumstick', [['path', {
  d: 'M15.45 15.4c-2.13.65-4.3.32-5.7-1.1-2.29-2.27-1.76-6.5 1.17-9.42 2.93-2.93 7.15-3.46 9.43-1.18 1.41 1.41 1.74 3.57 1.1 5.71-1.4-.51-3.26-.02-4.64 1.36-1.38 1.38-1.87 3.23-1.36 4.63z',
  key: '1o96s0'
}], ['path', {
  d: 'm11.25 15.6-2.16 2.16a2.5 2.5 0 1 1-4.56 1.73 2.49 2.49 0 0 1-1.41-4.24 2.5 2.5 0 0 1 3.14-.32l2.16-2.16',
  key: '14vv5h'
}]]);
var Drumstick$1 = Drumstick;

var EarOff = createReactComponent('EarOff', [['path', {
  d: 'M6 18.5a3.5 3.5 0 1 0 7 0c0-1.57.92-2.52 2.04-3.46',
  key: '1qngmn'
}], ['path', {
  d: 'M6 8.5c0-.75.13-1.47.36-2.14',
  key: 'b06bma'
}], ['path', {
  d: 'M8.8 3.15A6.5 6.5 0 0 1 19 8.5c0 1.63-.44 2.81-1.09 3.76',
  key: 'g10hsz'
}], ['path', {
  d: 'M12.5 6A2.5 2.5 0 0 1 15 8.5M10 13a2 2 0 0 0 1.82-1.18',
  key: 'ygzou7'
}], ['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}]]);
var EarOff$1 = EarOff;

var Ear = createReactComponent('Ear', [['path', {
  d: 'M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0',
  key: '1dfaln'
}], ['path', {
  d: 'M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4',
  key: '1qnva7'
}]]);
var Ear$1 = Ear;

var Edit2 = createReactComponent('Edit2', [['path', {
  d: 'M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z',
  key: '2s2c1q'
}]]);
var Edit2$1 = Edit2;

var Edit3 = createReactComponent('Edit3', [['path', {
  d: 'M12 20h9',
  key: 't2du7b'
}], ['path', {
  d: 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
  key: '18w55b'
}]]);
var Edit3$1 = Edit3;

var Edit = createReactComponent('Edit', [['path', {
  d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
  key: '1qinfi'
}], ['path', {
  d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  key: '1cs3r3'
}]]);
var Edit$1 = Edit;

var EggFried = createReactComponent('EggFried', [['circle', {
  cx: '11.5',
  cy: '12.5',
  r: '3.5',
  key: '1cl1mi'
}], ['path', {
  d: 'M3 8c0-3.5 2.5-6 6.5-6 5 0 4.83 3 7.5 5s5 2 5 6c0 4.5-2.5 6.5-7 6.5-2.5 0-2.5 2.5-6 2.5s-7-2-7-5.5c0-3 1.5-3 1.5-5C3.5 10 3 9 3 8Z',
  key: '165ef9'
}]]);
var EggFried$1 = EggFried;

var Egg = createReactComponent('Egg', [['path', {
  d: 'M12 22c6.23-.05 7.87-5.57 7.5-10-.36-4.34-3.95-9.96-7.5-10-3.55.04-7.14 5.66-7.5 10-.37 4.43 1.27 9.95 7.5 10z',
  key: '1c39pg'
}]]);
var Egg$1 = Egg;

var EqualNot = createReactComponent('EqualNot', [['line', {
  x1: '5',
  y1: '9',
  x2: '19',
  y2: '9',
  key: 'p612hi'
}], ['line', {
  x1: '5',
  y1: '15',
  x2: '19',
  y2: '15',
  key: 'e39u1i'
}], ['line', {
  x1: '19',
  y1: '5',
  x2: '5',
  y2: '19',
  key: 't1677v'
}]]);
var EqualNot$1 = EqualNot;

var Equal = createReactComponent('Equal', [['line', {
  x1: '5',
  y1: '9',
  x2: '19',
  y2: '9',
  key: 'p612hi'
}], ['line', {
  x1: '5',
  y1: '15',
  x2: '19',
  y2: '15',
  key: 'e39u1i'
}]]);
var Equal$1 = Equal;

var Eraser = createReactComponent('Eraser', [['path', {
  d: 'm7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21',
  key: '182aya'
}], ['path', {
  d: 'M22 21H7',
  key: 't4ddhn'
}], ['path', {
  d: 'm5 11 9 9',
  key: '1mo9qw'
}]]);
var Eraser$1 = Eraser;

var Euro = createReactComponent('Euro', [['path', {
  d: 'M4 10h12',
  key: '1y6xl8'
}], ['path', {
  d: 'M4 14h9',
  key: '1loblj'
}], ['path', {
  d: 'M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2',
  key: '1j6lzo'
}]]);
var Euro$1 = Euro;

var Expand = createReactComponent('Expand', [['path', {
  d: 'm21 21-6-6m6 6v-4.8m0 4.8h-4.8',
  key: '1c15vz'
}], ['path', {
  d: 'M3 16.2V21m0 0h4.8M3 21l6-6',
  key: '1fsnz2'
}], ['path', {
  d: 'M21 7.8V3m0 0h-4.8M21 3l-6 6',
  key: 'hawz9i'
}], ['path', {
  d: 'M3 7.8V3m0 0h4.8M3 3l6 6',
  key: 'u9ee12'
}]]);
var Expand$1 = Expand;

var ExternalLink = createReactComponent('ExternalLink', [['path', {
  d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  key: 'a6xqqp'
}], ['polyline', {
  points: '15 3 21 3 21 9',
  key: 'mznyad'
}], ['line', {
  x1: '10',
  y1: '14',
  x2: '21',
  y2: '3',
  key: '19d9un'
}]]);
var ExternalLink$1 = ExternalLink;

var EyeOff = createReactComponent('EyeOff', [['path', {
  d: 'M9.88 9.88a3 3 0 1 0 4.24 4.24',
  key: '1jxqfv'
}], ['path', {
  d: 'M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68',
  key: '9wicm4'
}], ['path', {
  d: 'M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61',
  key: '1jreej'
}], ['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}]]);
var EyeOff$1 = EyeOff;

var Eye = createReactComponent('Eye', [['path', {
  d: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z',
  key: 'rwhkz3'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '3',
  key: '1v7zrd'
}]]);
var Eye$1 = Eye;

var Facebook = createReactComponent('Facebook', [['path', {
  d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  key: '1jg4f8'
}]]);
var Facebook$1 = Facebook;

var Factory = createReactComponent('Factory', [['path', {
  d: 'M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z',
  key: '159hny'
}], ['path', {
  d: 'M17 18h1',
  key: 'uldtlt'
}], ['path', {
  d: 'M12 18h1',
  key: 's9uhes'
}], ['path', {
  d: 'M7 18h1',
  key: '1neino'
}]]);
var Factory$1 = Factory;

var Fan = createReactComponent('Fan', [['path', {
  d: 'M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z',
  key: '484a7f'
}], ['path', {
  d: 'M12 12v.01',
  key: 'u5ubse'
}]]);
var Fan$1 = Fan;

var FastForward = createReactComponent('FastForward', [['polygon', {
  points: '13 19 22 12 13 5 13 19',
  key: '587y9g'
}], ['polygon', {
  points: '2 19 11 12 2 5 2 19',
  key: '3pweh0'
}]]);
var FastForward$1 = FastForward;

var Feather = createReactComponent('Feather', [['path', {
  d: 'M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z',
  key: 'u4sw5n'
}], ['line', {
  x1: '16',
  y1: '8',
  x2: '2',
  y2: '22',
  key: 'ay4g5i'
}], ['line', {
  x1: '17.5',
  y1: '15',
  x2: '9',
  y2: '15',
  key: 'c4zw0f'
}]]);
var Feather$1 = Feather;

var Figma = createReactComponent('Figma', [['path', {
  d: 'M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z',
  key: '1340ok'
}], ['path', {
  d: 'M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z',
  key: '1hz3m3'
}], ['path', {
  d: 'M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z',
  key: '1oz8n2'
}], ['path', {
  d: 'M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z',
  key: '1ff65i'
}], ['path', {
  d: 'M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z',
  key: 'pdip6e'
}]]);
var Figma$1 = Figma;

var FileArchive = createReactComponent('FileArchive', [['path', {
  d: 'M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h8.5L20 7.5V20c0 .5-.2 1-.6 1.4-.4.4-.9.6-1.4.6h-2',
  key: '1u864v'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['circle', {
  cx: '10',
  cy: '20',
  r: '2',
  key: '1xzdoj'
}], ['path', {
  d: 'M10 7V6',
  key: 'dljcrl'
}], ['path', {
  d: 'M10 12v-1',
  key: 'v7bkov'
}], ['path', {
  d: 'M10 18v-2',
  key: '1cjy8d'
}]]);
var FileArchive$1 = FileArchive;

var FileAudio2 = createReactComponent('FileAudio2', [['path', {
  d: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v2',
  key: 'fkyf72'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M2 17v-3a4 4 0 0 1 8 0v3',
  key: '1ggdre'
}], ['circle', {
  cx: '9',
  cy: '17',
  r: '1',
  key: 'bc1fq4'
}], ['circle', {
  cx: '3',
  cy: '17',
  r: '1',
  key: 'vo6nti'
}]]);
var FileAudio2$1 = FileAudio2;

var FileAudio = createReactComponent('FileAudio', [['path', {
  d: 'M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3',
  key: '1013sb'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M10 20v-1a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0Z',
  key: 'gqt63y'
}], ['path', {
  d: 'M6 20v-1a2 2 0 1 0-4 0v1a2 2 0 1 0 4 0Z',
  key: 'cf7lqx'
}], ['path', {
  d: 'M2 19v-3a6 6 0 0 1 12 0v3',
  key: '1acxgf'
}]]);
var FileAudio$1 = FileAudio;

var FileAxis3d = createReactComponent('FileAxis3d', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M8 10v8h8',
  key: 'tlaukw'
}], ['path', {
  d: 'm8 18 4-4',
  key: '12zab0'
}]]);
var FileAxis3d$1 = FileAxis3d;

var FileBadge2 = createReactComponent('FileBadge2', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['path', {
  d: 'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  key: '13rien'
}], ['path', {
  d: 'm14 12.5 1 5.5-3-1-3 1 1-5.5',
  key: '14xlky'
}]]);
var FileBadge2$1 = FileBadge2;

var FileBadge = createReactComponent('FileBadge', [['path', {
  d: 'M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-6',
  key: 'qtddq0'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  key: 'u0c8gj'
}], ['path', {
  d: 'M7 16.5 8 22l-3-1-3 1 1-5.5',
  key: '5gm2nr'
}]]);
var FileBadge$1 = FileBadge;

var FileBarChart2 = createReactComponent('FileBarChart2', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M12 18v-6',
  key: '17g6i2'
}], ['path', {
  d: 'M8 18v-1',
  key: 'zg0ygc'
}], ['path', {
  d: 'M16 18v-3',
  key: 'j5jt4h'
}]]);
var FileBarChart2$1 = FileBarChart2;

var FileBarChart = createReactComponent('FileBarChart', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M12 18v-4',
  key: 'q1q25u'
}], ['path', {
  d: 'M8 18v-2',
  key: 'qcmpov'
}], ['path', {
  d: 'M16 18v-6',
  key: '15y0np'
}]]);
var FileBarChart$1 = FileBarChart;

var FileBox = createReactComponent('FileBox', [['path', {
  d: 'M14.5 22H18a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4',
  key: 'h7jej2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M2.97 13.12c-.6.36-.97 1.02-.97 1.74v3.28c0 .72.37 1.38.97 1.74l3 1.83c.63.39 1.43.39 2.06 0l3-1.83c.6-.36.97-1.02.97-1.74v-3.28c0-.72-.37-1.38-.97-1.74l-3-1.83a1.97 1.97 0 0 0-2.06 0l-3 1.83Z',
  key: 'f4a3oc'
}], ['path', {
  d: 'm7 17-4.74-2.85',
  key: 'etm6su'
}], ['path', {
  d: 'm7 17 4.74-2.85',
  key: '5xuooz'
}], ['path', {
  d: 'M7 17v5',
  key: '1yj1jh'
}]]);
var FileBox$1 = FileBox;

var FileCheck2 = createReactComponent('FileCheck2', [['path', {
  d: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4',
  key: '702lig'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'm3 15 2 2 4-4',
  key: '1lhrkk'
}]]);
var FileCheck2$1 = FileCheck2;

var FileCheck = createReactComponent('FileCheck', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'm9 15 2 2 4-4',
  key: '1grp1n'
}]]);
var FileCheck$1 = FileCheck;

var FileClock = createReactComponent('FileClock', [['path', {
  d: 'M16 22h2c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3',
  key: '9lo3o3'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['circle', {
  cx: '8',
  cy: '16',
  r: '6',
  key: '10v15b'
}], ['path', {
  d: 'M9.5 17.5 8 16.25V14',
  key: '1o80t2'
}]]);
var FileClock$1 = FileClock;

var FileCode = createReactComponent('FileCode', [['path', {
  d: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4',
  key: '702lig'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'm9 18 3-3-3-3',
  key: '112psh'
}], ['path', {
  d: 'm5 12-3 3 3 3',
  key: 'oke12k'
}]]);
var FileCode$1 = FileCode;

var FileCog2 = createReactComponent('FileCog2', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['circle', {
  cx: '12',
  cy: '15',
  r: '2',
  key: '1vpstw'
}], ['path', {
  d: 'M12 12v1',
  key: '1vuyxr'
}], ['path', {
  d: 'M12 17v1',
  key: 'y8y3f9'
}], ['path', {
  d: 'm14.6 13.5-.87.5',
  key: 'nomeg4'
}], ['path', {
  d: 'm10.27 16-.87.5',
  key: '1o8v95'
}], ['path', {
  d: 'm14.6 16.5-.87-.5',
  key: 'gzu2jw'
}], ['path', {
  d: 'm10.27 14-.87-.5',
  key: '1vlkk3'
}]]);
var FileCog2$1 = FileCog2;

var FileCog = createReactComponent('FileCog', [['path', {
  d: 'M4 6V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4',
  key: 'dba9qu'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['circle', {
  cx: '6',
  cy: '14',
  r: '3',
  key: 'a1xfv6'
}], ['path', {
  d: 'M6 10v1',
  key: 'xs0f9j'
}], ['path', {
  d: 'M6 17v1',
  key: 'idyhc0'
}], ['path', {
  d: 'M10 14H9',
  key: 'm5fm2q'
}], ['path', {
  d: 'M3 14H2',
  key: '19ot09'
}], ['path', {
  d: 'm9 11-.88.88',
  key: 'lhul2b'
}], ['path', {
  d: 'M3.88 16.12 3 17',
  key: '169z9n'
}], ['path', {
  d: 'm9 17-.88-.88',
  key: '5io96w'
}], ['path', {
  d: 'M3.88 11.88 3 11',
  key: '1ynhy1'
}]]);
var FileCog$1 = FileCog;

var FileDiff = createReactComponent('FileDiff', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['path', {
  d: 'M12 13V7',
  key: 'h0r20n'
}], ['path', {
  d: 'M9 10h6',
  key: '9gxzsh'
}], ['path', {
  d: 'M9 17h6',
  key: 'r8uit2'
}]]);
var FileDiff$1 = FileDiff;

var FileDigit = createReactComponent('FileDigit', [['path', {
  d: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4',
  key: '702lig'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M10 12h2v6',
  key: '12zw74'
}], ['rect', {
  x: '2',
  y: '12',
  width: '4',
  height: '6',
  key: 'kg2lqm'
}], ['path', {
  d: 'M10 18h4',
  key: '1ulq68'
}]]);
var FileDigit$1 = FileDigit;

var FileDown = createReactComponent('FileDown', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M12 18v-6',
  key: '17g6i2'
}], ['path', {
  d: 'm9 15 3 3 3-3',
  key: '1npd3o'
}]]);
var FileDown$1 = FileDown;

var FileEdit = createReactComponent('FileEdit', [['path', {
  d: 'M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5',
  key: '1bg6eb'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z',
  key: '1rgxu8'
}]]);
var FileEdit$1 = FileEdit;

var FileHeart = createReactComponent('FileHeart', [['path', {
  d: 'M4 6V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4',
  key: 'dba9qu'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M10.29 10.7a2.43 2.43 0 0 0-2.66-.52c-.29.12-.56.3-.78.53l-.35.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L6.5 18l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z',
  key: '1c1fso'
}]]);
var FileHeart$1 = FileHeart;

var FileImage = createReactComponent('FileImage', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['circle', {
  cx: '10',
  cy: '13',
  r: '2',
  key: '6v46hv'
}], ['path', {
  d: 'm20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22',
  key: '17vly1'
}]]);
var FileImage$1 = FileImage;

var FileInput = createReactComponent('FileInput', [['path', {
  d: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4',
  key: '702lig'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M2 15h10',
  key: 'jfw4w8'
}], ['path', {
  d: 'm9 18 3-3-3-3',
  key: '112psh'
}]]);
var FileInput$1 = FileInput;

var FileJson2 = createReactComponent('FileJson2', [['path', {
  d: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4',
  key: '702lig'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M4 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1',
  key: 'fq0c9t'
}], ['path', {
  d: 'M8 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1',
  key: '4gibmv'
}]]);
var FileJson2$1 = FileJson2;

var FileJson = createReactComponent('FileJson', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1',
  key: '1oajmo'
}], ['path', {
  d: 'M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1',
  key: 'mpwhp6'
}]]);
var FileJson$1 = FileJson;

var FileKey2 = createReactComponent('FileKey2', [['path', {
  d: 'M4 10V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4',
  key: '1nw5t3'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['circle', {
  cx: '4',
  cy: '16',
  r: '2',
  key: '1ehqvc'
}], ['path', {
  d: 'm10 10-4.5 4.5',
  key: '7fwrp6'
}], ['path', {
  d: 'm9 11 1 1',
  key: 'wa6s5q'
}]]);
var FileKey2$1 = FileKey2;

var FileKey = createReactComponent('FileKey', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['circle', {
  cx: '10',
  cy: '16',
  r: '2',
  key: '4ckbqe'
}], ['path', {
  d: 'm16 10-4.5 4.5',
  key: '7p3ebg'
}], ['path', {
  d: 'm15 11 1 1',
  key: '1bsyx3'
}]]);
var FileKey$1 = FileKey;

var FileLineChart = createReactComponent('FileLineChart', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'm16 13-3.5 3.5-2-2L8 17',
  key: 'zz7yod'
}]]);
var FileLineChart$1 = FileLineChart;

var FileLock2 = createReactComponent('FileLock2', [['path', {
  d: 'M4 5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4',
  key: 'gwd2r9'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['rect', {
  x: '2',
  y: '13',
  width: '8',
  height: '5',
  rx: '1',
  key: 'lkev2l'
}], ['path', {
  d: 'M8 13v-2a2 2 0 1 0-4 0v2',
  key: '1pdxzg'
}]]);
var FileLock2$1 = FileLock2;

var FileLock = createReactComponent('FileLock', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['rect', {
  x: '8',
  y: '12',
  width: '8',
  height: '6',
  rx: '1',
  key: 'hql291'
}], ['path', {
  d: 'M15 12v-2a3 3 0 1 0-6 0v2',
  key: '1nqnhw'
}]]);
var FileLock$1 = FileLock;

var FileMinus2 = createReactComponent('FileMinus2', [['path', {
  d: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4',
  key: '702lig'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M3 15h6',
  key: '4e2qda'
}]]);
var FileMinus2$1 = FileMinus2;

var FileMinus = createReactComponent('FileMinus', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['line', {
  x1: '9',
  y1: '15',
  x2: '15',
  y2: '15',
  key: '1hgpwl'
}]]);
var FileMinus$1 = FileMinus;

var FileOutput = createReactComponent('FileOutput', [['path', {
  d: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4',
  key: '702lig'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M2 15h10',
  key: 'jfw4w8'
}], ['path', {
  d: 'm5 12-3 3 3 3',
  key: 'oke12k'
}]]);
var FileOutput$1 = FileOutput;

var FilePieChart = createReactComponent('FilePieChart', [['path', {
  d: 'M16 22h2a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3',
  key: 'zhyrez'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M4.04 11.71a5.84 5.84 0 1 0 8.2 8.29',
  key: 'f1t5jc'
}], ['path', {
  d: 'M13.83 16A5.83 5.83 0 0 0 8 10.17V16h5.83Z',
  key: '7q54ec'
}]]);
var FilePieChart$1 = FilePieChart;

var FilePlus2 = createReactComponent('FilePlus2', [['path', {
  d: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4',
  key: '702lig'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M3 15h6',
  key: '4e2qda'
}], ['path', {
  d: 'M6 12v6',
  key: '1u72j0'
}]]);
var FilePlus2$1 = FilePlus2;

var FilePlus = createReactComponent('FilePlus', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['line', {
  x1: '12',
  y1: '18',
  x2: '12',
  y2: '12',
  key: '16t3gy'
}], ['line', {
  x1: '9',
  y1: '15',
  x2: '15',
  y2: '15',
  key: '1hgpwl'
}]]);
var FilePlus$1 = FilePlus;

var FileQuestion = createReactComponent('FileQuestion', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['path', {
  d: 'M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2',
  key: '1umxtm'
}], ['path', {
  d: 'M12 17h.01',
  key: 'p32p05'
}]]);
var FileQuestion$1 = FileQuestion;

var FileScan = createReactComponent('FileScan', [['path', {
  d: 'M20 10V7.5L14.5 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h4.5',
  key: 'uvikde'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M16 22a2 2 0 0 1-2-2',
  key: '1wqh5n'
}], ['path', {
  d: 'M20 22a2 2 0 0 0 2-2',
  key: '1l9q4k'
}], ['path', {
  d: 'M20 14a2 2 0 0 1 2 2',
  key: '1ny6zw'
}], ['path', {
  d: 'M16 14a2 2 0 0 0-2 2',
  key: 'ceaadl'
}]]);
var FileScan$1 = FileScan;

var FileSearch2 = createReactComponent('FileSearch2', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['circle', {
  cx: '11.5',
  cy: '14.5',
  r: '2.5',
  key: '1bq0ko'
}], ['path', {
  d: 'M13.25 16.25 15 18',
  key: '9eh8bj'
}]]);
var FileSearch2$1 = FileSearch2;

var FileSearch = createReactComponent('FileSearch', [['path', {
  d: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3',
  key: 'am10z3'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  key: 'ychnub'
}], ['path', {
  d: 'm9 18-1.5-1.5',
  key: '1j6qii'
}]]);
var FileSearch$1 = FileSearch;

var FileSignature = createReactComponent('FileSignature', [['path', {
  d: 'M20 19.5v.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8.5L18 5.5',
  key: 'kd5d3'
}], ['path', {
  d: 'M8 18h1',
  key: '13wk12'
}], ['path', {
  d: 'M18.42 9.61a2.1 2.1 0 1 1 2.97 2.97L16.95 17 13 18l.99-3.95 4.43-4.44Z',
  key: 'johvi5'
}]]);
var FileSignature$1 = FileSignature;

var FileSpreadsheet = createReactComponent('FileSpreadsheet', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M8 13h2',
  key: 'yr2amv'
}], ['path', {
  d: 'M8 17h2',
  key: '2yhykz'
}], ['path', {
  d: 'M14 13h2',
  key: 'un5t4a'
}], ['path', {
  d: 'M14 17h2',
  key: '10kma7'
}]]);
var FileSpreadsheet$1 = FileSpreadsheet;

var FileSymlink = createReactComponent('FileSymlink', [['path', {
  d: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v7',
  key: '138uzh'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'm10 18 3-3-3-3',
  key: '18f6ys'
}], ['path', {
  d: 'M4 18v-1a2 2 0 0 1 2-2h6',
  key: '5uz2rn'
}]]);
var FileSymlink$1 = FileSymlink;

var FileTerminal = createReactComponent('FileTerminal', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'm8 16 2-2-2-2',
  key: '10vzyd'
}], ['path', {
  d: 'M12 18h4',
  key: '1wd2n7'
}]]);
var FileTerminal$1 = FileTerminal;

var FileText = createReactComponent('FileText', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['line', {
  x1: '16',
  y1: '13',
  x2: '8',
  y2: '13',
  key: '7g4hpw'
}], ['line', {
  x1: '16',
  y1: '17',
  x2: '8',
  y2: '17',
  key: '1nzzn0'
}], ['line', {
  x1: '10',
  y1: '9',
  x2: '8',
  y2: '9',
  key: '13jkcr'
}]]);
var FileText$1 = FileText;

var FileType2 = createReactComponent('FileType2', [['path', {
  d: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4',
  key: '702lig'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M2 13v-1h6v1',
  key: '1dh9dg'
}], ['path', {
  d: 'M4 18h2',
  key: '1xrofg'
}], ['path', {
  d: 'M5 12v6',
  key: '150t9c'
}]]);
var FileType2$1 = FileType2;

var FileType = createReactComponent('FileType', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M9 13v-1h6v1',
  key: '1bb014'
}], ['path', {
  d: 'M11 18h2',
  key: '12mj7e'
}], ['path', {
  d: 'M12 12v6',
  key: '3ahymv'
}]]);
var FileType$1 = FileType;

var FileUp = createReactComponent('FileUp', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M12 12v6',
  key: '3ahymv'
}], ['path', {
  d: 'm15 15-3-3-3 3',
  key: '15xj92'
}]]);
var FileUp$1 = FileUp;

var FileVideo2 = createReactComponent('FileVideo2', [['path', {
  d: 'M4 8V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4',
  key: '1nti49'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'm10 15.5 4 2.5v-6l-4 2.5',
  key: 't7cp39'
}], ['rect', {
  x: '2',
  y: '12',
  width: '8',
  height: '6',
  rx: '1',
  key: '1fgd6b'
}]]);
var FileVideo2$1 = FileVideo2;

var FileVideo = createReactComponent('FileVideo', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'm10 11 5 3-5 3v-6Z',
  key: '7ntvm4'
}]]);
var FileVideo$1 = FileVideo;

var FileVolume2 = createReactComponent('FileVolume2', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'M11.5 13.5c.32.4.5.94.5 1.5s-.18 1.1-.5 1.5',
  key: 'joawwx'
}], ['path', {
  d: 'M15 12c.64.8 1 1.87 1 3s-.36 2.2-1 3',
  key: '1f2wyw'
}], ['path', {
  d: 'M8 15h.01',
  key: 'a7atzg'
}]]);
var FileVolume2$1 = FileVolume2;

var FileVolume = createReactComponent('FileVolume', [['path', {
  d: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3',
  key: 'am10z3'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['path', {
  d: 'm7 10-3 2H2v4h2l3 2v-8Z',
  key: 'tazg57'
}], ['path', {
  d: 'M11 11c.64.8 1 1.87 1 3s-.36 2.2-1 3',
  key: '1yej3m'
}]]);
var FileVolume$1 = FileVolume;

var FileWarning = createReactComponent('FileWarning', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['path', {
  d: 'M12 9v4',
  key: 'juzpu7'
}], ['path', {
  d: 'M12 17h.01',
  key: 'p32p05'
}]]);
var FileWarning$1 = FileWarning;

var FileX2 = createReactComponent('FileX2', [['path', {
  d: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4',
  key: '702lig'
}], ['path', {
  d: 'M14 2v6h6',
  key: '1kof46'
}], ['path', {
  d: 'm3 12.5 5 5',
  key: '1qls4r'
}], ['path', {
  d: 'm8 12.5-5 5',
  key: 'b853mi'
}]]);
var FileX2$1 = FileX2;

var FileX = createReactComponent('FileX', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}], ['line', {
  x1: '9.5',
  y1: '12.5',
  x2: '14.5',
  y2: '17.5',
  key: 'bu76mq'
}], ['line', {
  x1: '14.5',
  y1: '12.5',
  x2: '9.5',
  y2: '17.5',
  key: 'nmydn6'
}]]);
var FileX$1 = FileX;

var File = createReactComponent('File', [['path', {
  d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
  key: '1nnpy2'
}], ['polyline', {
  points: '14 2 14 8 20 8',
  key: '1ew0cm'
}]]);
var File$1 = File;

var Files = createReactComponent('Files', [['path', {
  d: 'M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z',
  key: 'cennsq'
}], ['path', {
  d: 'M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8',
  key: 'ms809a'
}], ['path', {
  d: 'M15 2v5h5',
  key: 'qq6kwv'
}]]);
var Files$1 = Files;

var Film = createReactComponent('Film', [['rect', {
  x: '2',
  y: '2',
  width: '20',
  height: '20',
  rx: '2.18',
  ry: '2.18',
  key: '15u6kw'
}], ['line', {
  x1: '7',
  y1: '2',
  x2: '7',
  y2: '22',
  key: 'io8xnd'
}], ['line', {
  x1: '17',
  y1: '2',
  x2: '17',
  y2: '22',
  key: '1ewgih'
}], ['line', {
  x1: '2',
  y1: '12',
  x2: '22',
  y2: '12',
  key: 'zvmn4p'
}], ['line', {
  x1: '2',
  y1: '7',
  x2: '7',
  y2: '7',
  key: '15jszs'
}], ['line', {
  x1: '2',
  y1: '17',
  x2: '7',
  y2: '17',
  key: 'qjw6jy'
}], ['line', {
  x1: '17',
  y1: '17',
  x2: '22',
  y2: '17',
  key: '132yhf'
}], ['line', {
  x1: '17',
  y1: '7',
  x2: '22',
  y2: '7',
  key: 'bl3oy5'
}]]);
var Film$1 = Film;

var Filter = createReactComponent('Filter', [['polygon', {
  points: '22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3',
  key: '1yg77f'
}]]);
var Filter$1 = Filter;

var Fingerprint = createReactComponent('Fingerprint', [['path', {
  d: 'M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4',
  key: '1jc9o5'
}], ['path', {
  d: 'M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2',
  key: '1mxgy1'
}], ['path', {
  d: 'M17.29 21.02c.12-.6.43-2.3.5-3.02',
  key: 'ptglia'
}], ['path', {
  d: 'M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4',
  key: '1nerag'
}], ['path', {
  d: 'M8.65 22c.21-.66.45-1.32.57-2',
  key: '13wd9y'
}], ['path', {
  d: 'M14 13.12c0 2.38 0 6.38-1 8.88',
  key: 'o46ks0'
}], ['path', {
  d: 'M2 16h.01',
  key: '1gqxmh'
}], ['path', {
  d: 'M21.8 16c.2-2 .131-5.354 0-6',
  key: 'drycrb'
}], ['path', {
  d: 'M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2',
  key: '1fgabc'
}]]);
var Fingerprint$1 = Fingerprint;

var FlagOff = createReactComponent('FlagOff', [['path', {
  d: 'M8 2c3 0 5 2 8 2s4-1 4-1v11',
  key: '9rwyz9'
}], ['path', {
  d: 'M4 22V4',
  key: '1plyxx'
}], ['path', {
  d: 'M4 15s1-1 4-1 5 2 8 2',
  key: '1myooe'
}], ['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}]]);
var FlagOff$1 = FlagOff;

var FlagTriangleLeft = createReactComponent('FlagTriangleLeft', [['path', {
  d: 'M17 22V2L7 7l10 5',
  key: '1rmf0r'
}]]);
var FlagTriangleLeft$1 = FlagTriangleLeft;

var FlagTriangleRight = createReactComponent('FlagTriangleRight', [['path', {
  d: 'M7 22V2l10 5-10 5',
  key: '17n18y'
}]]);
var FlagTriangleRight$1 = FlagTriangleRight;

var Flag = createReactComponent('Flag', [['path', {
  d: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z',
  key: 'i9b6wo'
}], ['line', {
  x1: '4',
  y1: '22',
  x2: '4',
  y2: '15',
  key: '1k23bw'
}]]);
var Flag$1 = Flag;

var Flame = createReactComponent('Flame', [['path', {
  d: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
  key: '96xj49'
}]]);
var Flame$1 = Flame;

var FlashlightOff = createReactComponent('FlashlightOff', [['path', {
  d: 'M16 16v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4',
  key: '1r120k'
}], ['path', {
  d: 'M7 2h11v4c0 2-2 2-2 4v1',
  key: 'dz1920'
}], ['line', {
  x1: '11',
  y1: '6',
  x2: '18',
  y2: '6',
  key: 'q6oc82'
}], ['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}]]);
var FlashlightOff$1 = FlashlightOff;

var Flashlight = createReactComponent('Flashlight', [['path', {
  d: 'M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12z',
  key: '1orkel'
}], ['line', {
  x1: '6',
  y1: '6',
  x2: '18',
  y2: '6',
  key: 'tmfr4k'
}], ['line', {
  x1: '12',
  y1: '12',
  x2: '12',
  y2: '12',
  key: 'jyrcx7'
}]]);
var Flashlight$1 = Flashlight;

var FlaskConical = createReactComponent('FlaskConical', [['path', {
  d: 'M10 2v8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2',
  key: 'aka69c'
}], ['path', {
  d: 'M8.5 2h7',
  key: 'csnxdl'
}], ['path', {
  d: 'M7 16h10',
  key: 'wp8him'
}]]);
var FlaskConical$1 = FlaskConical;

var FlaskRound = createReactComponent('FlaskRound', [['path', {
  d: 'M10 2v7.31',
  key: '5d1hyh'
}], ['path', {
  d: 'M14 9.3V1.99',
  key: '14k4l0'
}], ['path', {
  d: 'M8.5 2h7',
  key: 'csnxdl'
}], ['path', {
  d: 'M14 9.3a6.5 6.5 0 1 1-4 0',
  key: '1r8fvy'
}], ['path', {
  d: 'M5.58 16.5h12.85',
  key: '78w9cl'
}]]);
var FlaskRound$1 = FlaskRound;

var FlipHorizontal2 = createReactComponent('FlipHorizontal2', [['path', {
  d: 'm3 7 5 5-5 5V7',
  key: 'couhi7'
}], ['path', {
  d: 'm21 7-5 5 5 5V7',
  key: '6ouia7'
}], ['path', {
  d: 'M12 20v2',
  key: '1lh1kg'
}], ['path', {
  d: 'M12 14v2',
  key: '8jcxud'
}], ['path', {
  d: 'M12 8v2',
  key: '1woqiv'
}], ['path', {
  d: 'M12 2v2',
  key: 'tus03m'
}]]);
var FlipHorizontal2$1 = FlipHorizontal2;

var FlipHorizontal = createReactComponent('FlipHorizontal', [['path', {
  d: 'M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3',
  key: '1i73f7'
}], ['path', {
  d: 'M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3',
  key: 'saxlbk'
}], ['path', {
  d: 'M12 20v2',
  key: '1lh1kg'
}], ['path', {
  d: 'M12 14v2',
  key: '8jcxud'
}], ['path', {
  d: 'M12 8v2',
  key: '1woqiv'
}], ['path', {
  d: 'M12 2v2',
  key: 'tus03m'
}]]);
var FlipHorizontal$1 = FlipHorizontal;

var FlipVertical2 = createReactComponent('FlipVertical2', [['path', {
  d: 'm17 3-5 5-5-5h10',
  key: '1ftt6x'
}], ['path', {
  d: 'm17 21-5-5-5 5h10',
  key: '1m0wmu'
}], ['path', {
  d: 'M4 12H2',
  key: 'rhcxmi'
}], ['path', {
  d: 'M10 12H8',
  key: 's88cx1'
}], ['path', {
  d: 'M16 12h-2',
  key: '10asgb'
}], ['path', {
  d: 'M22 12h-2',
  key: '14jgyd'
}]]);
var FlipVertical2$1 = FlipVertical2;

var FlipVertical = createReactComponent('FlipVertical', [['path', {
  d: 'M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3',
  key: '14bfxa'
}], ['path', {
  d: 'M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3',
  key: '14rx03'
}], ['path', {
  d: 'M4 12H2',
  key: 'rhcxmi'
}], ['path', {
  d: 'M10 12H8',
  key: 's88cx1'
}], ['path', {
  d: 'M16 12h-2',
  key: '10asgb'
}], ['path', {
  d: 'M22 12h-2',
  key: '14jgyd'
}]]);
var FlipVertical$1 = FlipVertical;

var Flower2 = createReactComponent('Flower2', [['path', {
  d: 'M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1',
  key: '3pnvol'
}], ['circle', {
  cx: '12',
  cy: '8',
  r: '2',
  key: '1822b1'
}], ['path', {
  d: 'M12 10v12',
  key: '6ubwww'
}], ['path', {
  d: 'M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z',
  key: '9hd38g'
}], ['path', {
  d: 'M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z',
  key: 'ufn41s'
}]]);
var Flower2$1 = Flower2;

var Flower = createReactComponent('Flower', [['path', {
  d: 'M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15',
  key: '51z86h'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '3',
  key: '1v7zrd'
}], ['path', {
  d: 'm8 16 1.5-1.5',
  key: 'ce6zph'
}], ['path', {
  d: 'M14.5 9.5 16 8',
  key: '1kzrzb'
}], ['path', {
  d: 'm8 8 1.5 1.5',
  key: '1yv88w'
}], ['path', {
  d: 'M14.5 14.5 16 16',
  key: '12xhjh'
}]]);
var Flower$1 = Flower;

var Focus = createReactComponent('Focus', [['circle', {
  cx: '12',
  cy: '12',
  r: '3',
  key: '1v7zrd'
}], ['path', {
  d: 'M3 7V5a2 2 0 0 1 2-2h2',
  key: 'aa7l1z'
}], ['path', {
  d: 'M17 3h2a2 2 0 0 1 2 2v2',
  key: '4qcy5o'
}], ['path', {
  d: 'M21 17v2a2 2 0 0 1-2 2h-2',
  key: '6vwrx8'
}], ['path', {
  d: 'M7 21H5a2 2 0 0 1-2-2v-2',
  key: 'ioqczr'
}]]);
var Focus$1 = Focus;

var FolderArchive = createReactComponent('FolderArchive', [['path', {
  d: 'M22 20V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2h6',
  key: '1l0vpk'
}], ['circle', {
  cx: '16',
  cy: '19',
  r: '2',
  key: '1uwppb'
}], ['path', {
  d: 'M16 11v-1',
  key: 'eoyjtm'
}], ['path', {
  d: 'M16 17v-2',
  key: '1xp69b'
}]]);
var FolderArchive$1 = FolderArchive;

var FolderCheck = createReactComponent('FolderCheck', [['path', {
  d: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z',
  key: '1fr9dc'
}], ['path', {
  d: 'm9 13 2 2 4-4',
  key: '6343dt'
}]]);
var FolderCheck$1 = FolderCheck;

var FolderClock = createReactComponent('FolderClock', [['path', {
  d: 'M7 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2',
  key: '1p0xo9'
}], ['circle', {
  cx: '16',
  cy: '16',
  r: '6',
  key: 'qoo3c4'
}], ['path', {
  d: 'M16 14v2l1 1',
  key: 'xth2jh'
}]]);
var FolderClock$1 = FolderClock;

var FolderClosed = createReactComponent('FolderClosed', [['path', {
  d: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z',
  key: '1fr9dc'
}], ['path', {
  d: 'M2 10h20',
  key: '1ir3d8'
}]]);
var FolderClosed$1 = FolderClosed;

var FolderCog2 = createReactComponent('FolderCog2', [['path', {
  d: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z',
  key: '1fr9dc'
}], ['circle', {
  cx: '12',
  cy: '13',
  r: '2',
  key: '1c1ljs'
}], ['path', {
  d: 'M12 10v1',
  key: 'ngorzm'
}], ['path', {
  d: 'M12 15v1',
  key: '1ovrzm'
}], ['path', {
  d: 'm14.6 11.5-.87.5',
  key: 'zm6w6e'
}], ['path', {
  d: 'm10.27 14-.87.5',
  key: 'idea33'
}], ['path', {
  d: 'm14.6 14.5-.87-.5',
  key: '1ii18h'
}], ['path', {
  d: 'm10.27 12-.87-.5',
  key: 'tf2vd0'
}]]);
var FolderCog2$1 = FolderCog2;

var FolderCog = createReactComponent('FolderCog', [['path', {
  d: 'M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3',
  key: '1g1zaq'
}], ['circle', {
  cx: '18',
  cy: '18',
  r: '3',
  key: '1xkwt0'
}], ['path', {
  d: 'M18 14v1',
  key: '1sx9hk'
}], ['path', {
  d: 'M18 21v1',
  key: 'pviwm2'
}], ['path', {
  d: 'M22 18h-1',
  key: 'phgwqy'
}], ['path', {
  d: 'M15 18h-1',
  key: '1v9fvv'
}], ['path', {
  d: 'm21 15-.88.88',
  key: '13nfy4'
}], ['path', {
  d: 'M15.88 20.12 15 21',
  key: 'qplfkl'
}], ['path', {
  d: 'm21 21-.88-.88',
  key: '1ryrr1'
}], ['path', {
  d: 'M15.88 15.88 15 15',
  key: '4terp3'
}]]);
var FolderCog$1 = FolderCog;

var FolderDown = createReactComponent('FolderDown', [['path', {
  d: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z',
  key: '1fr9dc'
}], ['path', {
  d: 'M12 10v6',
  key: '1bos4e'
}], ['path', {
  d: 'm15 13-3 3-3-3',
  key: '6j2sf0'
}]]);
var FolderDown$1 = FolderDown;

var FolderEdit = createReactComponent('FolderEdit', [['path', {
  d: 'M8.42 10.61a2.1 2.1 0 1 1 2.97 2.97L5.95 19 2 20l.99-3.95 5.43-5.44Z',
  key: 'o1ah0z'
}], ['path', {
  d: 'M2 11.5V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5',
  key: 'bim890'
}]]);
var FolderEdit$1 = FolderEdit;

var FolderHeart = createReactComponent('FolderHeart', [['path', {
  d: 'M11 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v1.5',
  key: 'zoglpu'
}], ['path', {
  d: 'M21.29 13.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L17.5 21l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z',
  key: '2tfff6'
}]]);
var FolderHeart$1 = FolderHeart;

var FolderInput = createReactComponent('FolderInput', [['path', {
  d: 'M2 9V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1',
  key: '1gu97c'
}], ['path', {
  d: 'M2 13h10',
  key: 'pgb2dq'
}], ['path', {
  d: 'm9 16 3-3-3-3',
  key: '6m91ic'
}]]);
var FolderInput$1 = FolderInput;

var FolderKey = createReactComponent('FolderKey', [['path', {
  d: 'M10 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v2',
  key: '203odn'
}], ['circle', {
  cx: '16',
  cy: '20',
  r: '2',
  key: '1vifvg'
}], ['path', {
  d: 'm22 14-4.5 4.5',
  key: '1ef6z8'
}], ['path', {
  d: 'm21 15 1 1',
  key: '1ejcpy'
}]]);
var FolderKey$1 = FolderKey;

var FolderLock = createReactComponent('FolderLock', [['path', {
  d: 'M10 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v2.5',
  key: '1ivsx8'
}], ['rect', {
  x: '14',
  y: '17',
  width: '8',
  height: '5',
  rx: '1',
  key: '15pjcy'
}], ['path', {
  d: 'M20 17v-2a2 2 0 1 0-4 0v2',
  key: 'pwaxnr'
}]]);
var FolderLock$1 = FolderLock;

var FolderMinus = createReactComponent('FolderMinus', [['path', {
  d: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z',
  key: '1fr9dc'
}], ['line', {
  x1: '9',
  y1: '13',
  x2: '15',
  y2: '13',
  key: '1nzi25'
}]]);
var FolderMinus$1 = FolderMinus;

var FolderOpen = createReactComponent('FolderOpen', [['path', {
  d: 'm6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2',
  key: '1nmvlm'
}]]);
var FolderOpen$1 = FolderOpen;

var FolderOutput = createReactComponent('FolderOutput', [['path', {
  d: 'M2 7.5V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2',
  key: 'jm8npq'
}], ['path', {
  d: 'M2 13h10',
  key: 'pgb2dq'
}], ['path', {
  d: 'm5 10-3 3 3 3',
  key: '1r8ie0'
}]]);
var FolderOutput$1 = FolderOutput;

var FolderPlus = createReactComponent('FolderPlus', [['path', {
  d: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z',
  key: '1fr9dc'
}], ['line', {
  x1: '12',
  y1: '10',
  x2: '12',
  y2: '16',
  key: '1fgwrs'
}], ['line', {
  x1: '9',
  y1: '13',
  x2: '15',
  y2: '13',
  key: '1nzi25'
}]]);
var FolderPlus$1 = FolderPlus;

var FolderSearch2 = createReactComponent('FolderSearch2', [['path', {
  d: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z',
  key: '1fr9dc'
}], ['circle', {
  cx: '11.5',
  cy: '12.5',
  r: '2.5',
  key: '1ea5ju'
}], ['path', {
  d: 'M13.27 14.27 15 16',
  key: '5hsvtf'
}]]);
var FolderSearch2$1 = FolderSearch2;

var FolderSearch = createReactComponent('FolderSearch', [['path', {
  d: 'M11 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v4',
  key: '1moo03'
}], ['circle', {
  cx: '17',
  cy: '17',
  r: '3',
  key: '18b49y'
}], ['path', {
  d: 'm21 21-1.5-1.5',
  key: '3sg1j'
}]]);
var FolderSearch$1 = FolderSearch;

var FolderSymlink = createReactComponent('FolderSymlink', [['path', {
  d: 'M2 9V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2',
  key: '1or2t8'
}], ['path', {
  d: 'm8 16 3-3-3-3',
  key: 'rlqrt1'
}], ['path', {
  d: 'M2 16v-1a2 2 0 0 1 2-2h6',
  key: 'pgw8ln'
}]]);
var FolderSymlink$1 = FolderSymlink;

var FolderTree = createReactComponent('FolderTree', [['path', {
  d: 'M13 10h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z',
  key: '10jzg2'
}], ['path', {
  d: 'M13 21h7a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.88a1 1 0 0 1-.9-.55l-.44-.9a1 1 0 0 0-.9-.55H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z',
  key: '1b9nqm'
}], ['path', {
  d: 'M3 3v2c0 1.1.9 2 2 2h3',
  key: '1wqwis'
}], ['path', {
  d: 'M3 3v13c0 1.1.9 2 2 2h3',
  key: '1bqeom'
}]]);
var FolderTree$1 = FolderTree;

var FolderUp = createReactComponent('FolderUp', [['path', {
  d: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z',
  key: '1fr9dc'
}], ['path', {
  d: 'M12 10v6',
  key: '1bos4e'
}], ['path', {
  d: 'm9 13 3-3 3 3',
  key: '1pxg3c'
}]]);
var FolderUp$1 = FolderUp;

var FolderX = createReactComponent('FolderX', [['path', {
  d: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z',
  key: '1fr9dc'
}], ['path', {
  d: 'm9.5 10.5 5 5',
  key: 'ra9qjz'
}], ['path', {
  d: 'm14.5 10.5-5 5',
  key: 'l2rkpq'
}]]);
var FolderX$1 = FolderX;

var Folder = createReactComponent('Folder', [['path', {
  d: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z',
  key: '1fr9dc'
}]]);
var Folder$1 = Folder;

var Folders = createReactComponent('Folders', [['path', {
  d: 'M8 17h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.93a2 2 0 0 1-1.66-.9l-.82-1.2a2 2 0 0 0-1.66-.9H8a2 2 0 0 0-2 2v9c0 1.1.9 2 2 2Z',
  key: '1aska4'
}], ['path', {
  d: 'M2 8v11c0 1.1.9 2 2 2h14',
  key: 'n13cji'
}]]);
var Folders$1 = Folders;

var FormInput = createReactComponent('FormInput', [['rect', {
  x: '2',
  y: '6',
  width: '20',
  height: '12',
  rx: '2',
  key: '1wpnh2'
}], ['path', {
  d: 'M12 12h.01',
  key: '1mp3jc'
}], ['path', {
  d: 'M17 12h.01',
  key: '1m0b6t'
}], ['path', {
  d: 'M7 12h.01',
  key: 'eqddd0'
}]]);
var FormInput$1 = FormInput;

var Forward = createReactComponent('Forward', [['polyline', {
  points: '15 17 20 12 15 7',
  key: '1w3sku'
}], ['path', {
  d: 'M4 18v-2a4 4 0 0 1 4-4h12',
  key: 'jmiej9'
}]]);
var Forward$1 = Forward;

var Frame = createReactComponent('Frame', [['line', {
  x1: '22',
  y1: '6',
  x2: '2',
  y2: '6',
  key: '181agm'
}], ['line', {
  x1: '22',
  y1: '18',
  x2: '2',
  y2: '18',
  key: '12x4ne'
}], ['line', {
  x1: '6',
  y1: '2',
  x2: '6',
  y2: '22',
  key: 'gjs6u1'
}], ['line', {
  x1: '18',
  y1: '2',
  x2: '18',
  y2: '22',
  key: '1hbgm0'
}]]);
var Frame$1 = Frame;

var Framer = createReactComponent('Framer', [['path', {
  d: 'M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7',
  key: '1a2nng'
}]]);
var Framer$1 = Framer;

var Frown = createReactComponent('Frown', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['path', {
  d: 'M16 16s-1.5-2-4-2-4 2-4 2',
  key: 'epbg0q'
}], ['line', {
  x1: '9',
  y1: '9',
  x2: '9.01',
  y2: '9',
  key: '141aaf'
}], ['line', {
  x1: '15',
  y1: '9',
  x2: '15.01',
  y2: '9',
  key: '1cyg3o'
}]]);
var Frown$1 = Frown;

var Fuel = createReactComponent('Fuel', [['line', {
  x1: '3',
  y1: '22',
  x2: '15',
  y2: '22',
  key: 'fc344c'
}], ['line', {
  x1: '4',
  y1: '9',
  x2: '14',
  y2: '9',
  key: 'htzs8q'
}], ['path', {
  d: 'M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18',
  key: '16j0yd'
}], ['path', {
  d: 'M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5',
  key: '8ur5zv'
}]]);
var Fuel$1 = Fuel;

var FunctionSquare = createReactComponent('FunctionSquare', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['path', {
  d: 'M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3',
  key: 'm1af9g'
}], ['path', {
  d: 'M9 11.2h5.7',
  key: '3zgcl2'
}]]);
var FunctionSquare$1 = FunctionSquare;

var Gamepad2 = createReactComponent('Gamepad2', [['line', {
  x1: '6',
  y1: '11',
  x2: '10',
  y2: '11',
  key: '19tls9'
}], ['line', {
  x1: '8',
  y1: '9',
  x2: '8',
  y2: '13',
  key: '6w9cvk'
}], ['line', {
  x1: '15',
  y1: '12',
  x2: '15.01',
  y2: '12',
  key: 'abmwhw'
}], ['line', {
  x1: '18',
  y1: '10',
  x2: '18.01',
  y2: '10',
  key: '19ehlv'
}], ['path', {
  d: 'M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z',
  key: 'mfqc10'
}]]);
var Gamepad2$1 = Gamepad2;

var Gamepad = createReactComponent('Gamepad', [['line', {
  x1: '6',
  y1: '12',
  x2: '10',
  y2: '12',
  key: 'xg250c'
}], ['line', {
  x1: '8',
  y1: '10',
  x2: '8',
  y2: '14',
  key: '1cn0zn'
}], ['line', {
  x1: '15',
  y1: '13',
  x2: '15.01',
  y2: '13',
  key: '1pybt0'
}], ['line', {
  x1: '18',
  y1: '11',
  x2: '18.01',
  y2: '11',
  key: '147dzq'
}], ['rect', {
  x: '2',
  y: '6',
  width: '20',
  height: '12',
  rx: '2',
  key: '1wpnh2'
}]]);
var Gamepad$1 = Gamepad;

var Gauge = createReactComponent('Gauge', [['path', {
  d: 'm12 15 3.5-3.5',
  key: '1sfa3b'
}], ['path', {
  d: 'M20.3 18c.4-1 .7-2.2.7-3.4C21 9.8 17 6 12 6s-9 3.8-9 8.6c0 1.2.3 2.4.7 3.4',
  key: 'rcs43o'
}]]);
var Gauge$1 = Gauge;

var Gavel = createReactComponent('Gavel', [['path', {
  d: 'm14 13-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L11 10',
  key: 'c9cbz0'
}], ['path', {
  d: 'm16 16 6-6',
  key: 'vzrcl6'
}], ['path', {
  d: 'm8 8 6-6',
  key: '18bi4p'
}], ['path', {
  d: 'm9 7 8 8',
  key: '5jnvq1'
}], ['path', {
  d: 'm21 11-8-8',
  key: 'z4y7zo'
}]]);
var Gavel$1 = Gavel;

var Gem = createReactComponent('Gem', [['polygon', {
  points: '6 3 18 3 22 9 12 22 2 9',
  key: '1kbvml'
}], ['path', {
  d: 'm12 22 4-13-3-6',
  key: '19hoeh'
}], ['path', {
  d: 'M12 22 8 9l3-6',
  key: '1klo0r'
}], ['path', {
  d: 'M2 9h20',
  key: '16fsjt'
}]]);
var Gem$1 = Gem;

var Ghost = createReactComponent('Ghost', [['path', {
  d: 'M9 10h.01',
  key: 'qbtxuw'
}], ['path', {
  d: 'M15 10h.01',
  key: '1qmjsl'
}], ['path', {
  d: 'M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z',
  key: 'uwwb07'
}]]);
var Ghost$1 = Ghost;

var Gift = createReactComponent('Gift', [['polyline', {
  points: '20 12 20 22 4 22 4 12',
  key: 'nda8fc'
}], ['rect', {
  x: '2',
  y: '7',
  width: '20',
  height: '5',
  key: '1k9o8g'
}], ['line', {
  x1: '12',
  y1: '22',
  x2: '12',
  y2: '7',
  key: '1tigeq'
}], ['path', {
  d: 'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z',
  key: 'zighg4'
}], ['path', {
  d: 'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  key: '1pa5tk'
}]]);
var Gift$1 = Gift;

var GitBranchPlus = createReactComponent('GitBranchPlus', [['path', {
  d: 'M6 3v12',
  key: 'qpgusn'
}], ['path', {
  d: 'M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  key: '1d02ji'
}], ['path', {
  d: 'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  key: 'chk6ph'
}], ['path', {
  d: 'M15 6a9 9 0 0 0-9 9',
  key: 'or332x'
}], ['path', {
  d: 'M18 15v6',
  key: '9wciyi'
}], ['path', {
  d: 'M21 18h-6',
  key: '139f0c'
}]]);
var GitBranchPlus$1 = GitBranchPlus;

var GitBranch = createReactComponent('GitBranch', [['line', {
  x1: '6',
  y1: '3',
  x2: '6',
  y2: '15',
  key: '1o40i7'
}], ['circle', {
  cx: '18',
  cy: '6',
  r: '3',
  key: '1h7g24'
}], ['circle', {
  cx: '6',
  cy: '18',
  r: '3',
  key: 'fqmcym'
}], ['path', {
  d: 'M18 9a9 9 0 0 1-9 9',
  key: 'n2h4wq'
}]]);
var GitBranch$1 = GitBranch;

var GitCommit = createReactComponent('GitCommit', [['circle', {
  cx: '12',
  cy: '12',
  r: '3',
  key: '1v7zrd'
}], ['line', {
  x1: '3',
  y1: '12',
  x2: '9',
  y2: '12',
  key: '1vg2s9'
}], ['line', {
  x1: '15',
  y1: '12',
  x2: '21',
  y2: '12',
  key: 'fnrdho'
}]]);
var GitCommit$1 = GitCommit;

var GitCompare = createReactComponent('GitCompare', [['circle', {
  cx: '18',
  cy: '18',
  r: '3',
  key: '1xkwt0'
}], ['circle', {
  cx: '6',
  cy: '6',
  r: '3',
  key: '1lh9wr'
}], ['path', {
  d: 'M13 6h3a2 2 0 0 1 2 2v7',
  key: '1yeb86'
}], ['path', {
  d: 'M11 18H8a2 2 0 0 1-2-2V9',
  key: '19pyzm'
}]]);
var GitCompare$1 = GitCompare;

var GitFork = createReactComponent('GitFork', [['circle', {
  cx: '12',
  cy: '18',
  r: '3',
  key: '1mpf1b'
}], ['circle', {
  cx: '6',
  cy: '6',
  r: '3',
  key: '1lh9wr'
}], ['circle', {
  cx: '18',
  cy: '6',
  r: '3',
  key: '1h7g24'
}], ['path', {
  d: 'M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9',
  key: 'c89w8i'
}], ['path', {
  d: 'M12 12v3',
  key: '158kv8'
}]]);
var GitFork$1 = GitFork;

var GitMerge = createReactComponent('GitMerge', [['circle', {
  cx: '18',
  cy: '18',
  r: '3',
  key: '1xkwt0'
}], ['circle', {
  cx: '6',
  cy: '6',
  r: '3',
  key: '1lh9wr'
}], ['path', {
  d: 'M6 21V9a9 9 0 0 0 9 9',
  key: '7kw0sc'
}]]);
var GitMerge$1 = GitMerge;

var GitPullRequestClosed = createReactComponent('GitPullRequestClosed', [['circle', {
  cx: '18',
  cy: '18',
  r: '3',
  key: '1xkwt0'
}], ['circle', {
  cx: '6',
  cy: '6',
  r: '3',
  key: '1lh9wr'
}], ['path', {
  d: 'M18 11.5V15',
  key: '65xf6f'
}], ['path', {
  d: 'm21 3-6 6',
  key: '16nqsk'
}], ['path', {
  d: 'm21 9-6-6',
  key: '9j17rh'
}], ['line', {
  x1: '6',
  y1: '9',
  x2: '6',
  y2: '21',
  key: '79th4h'
}]]);
var GitPullRequestClosed$1 = GitPullRequestClosed;

var GitPullRequestDraft = createReactComponent('GitPullRequestDraft', [['circle', {
  cx: '18',
  cy: '18',
  r: '3',
  key: '1xkwt0'
}], ['circle', {
  cx: '6',
  cy: '6',
  r: '3',
  key: '1lh9wr'
}], ['path', {
  d: 'M18 6V5',
  key: '1oao2s'
}], ['path', {
  d: 'M18 11v-1',
  key: '11c8tz'
}], ['line', {
  x1: '6',
  y1: '9',
  x2: '6',
  y2: '21',
  key: '79th4h'
}]]);
var GitPullRequestDraft$1 = GitPullRequestDraft;

var GitPullRequest = createReactComponent('GitPullRequest', [['circle', {
  cx: '18',
  cy: '18',
  r: '3',
  key: '1xkwt0'
}], ['circle', {
  cx: '6',
  cy: '6',
  r: '3',
  key: '1lh9wr'
}], ['path', {
  d: 'M13 6h3a2 2 0 0 1 2 2v7',
  key: '1yeb86'
}], ['line', {
  x1: '6',
  y1: '9',
  x2: '6',
  y2: '21',
  key: '79th4h'
}]]);
var GitPullRequest$1 = GitPullRequest;

var Github = createReactComponent('Github', [['path', {
  d: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4',
  key: 'tonef'
}], ['path', {
  d: 'M9 18c-4.51 2-5-2-7-2',
  key: '9comsn'
}]]);
var Github$1 = Github;

var Gitlab = createReactComponent('Gitlab', [['path', {
  d: 'm22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z',
  key: '148pdi'
}]]);
var Gitlab$1 = Gitlab;

var GlassWater = createReactComponent('GlassWater', [['path', {
  d: 'M15.2 22H8.8a2 2 0 0 1-2-1.79L5 3h14l-1.81 17.21A2 2 0 0 1 15.2 22Z',
  key: '48rfw3'
}], ['path', {
  d: 'M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0',
  key: 'mjntcy'
}]]);
var GlassWater$1 = GlassWater;

var Glasses = createReactComponent('Glasses', [['circle', {
  cx: '6',
  cy: '15',
  r: '4',
  key: 'vux9w4'
}], ['circle', {
  cx: '18',
  cy: '15',
  r: '4',
  key: '18o8ve'
}], ['path', {
  d: 'M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2',
  key: '1ag4bs'
}], ['path', {
  d: 'M2.5 13 5 7c.7-1.3 1.4-2 3-2',
  key: '1hm1gs'
}], ['path', {
  d: 'M21.5 13 19 7c-.7-1.3-1.5-2-3-2',
  key: '1r31ai'
}]]);
var Glasses$1 = Glasses;

var Globe2 = createReactComponent('Globe2', [['path', {
  d: 'M15 21v-4a2 2 0 0 1 2-2h4',
  key: '29t6hq'
}], ['path', {
  d: 'M7 4v2a3 3 0 0 0 3 2h0a2 2 0 0 1 2 2 2 2 0 0 0 4 0 2 2 0 0 1 2-2h3',
  key: '1q8o6e'
}], ['path', {
  d: 'M3 11h2a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v4',
  key: '10po7j'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}]]);
var Globe2$1 = Globe2;

var Globe = createReactComponent('Globe', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['line', {
  x1: '2',
  y1: '12',
  x2: '22',
  y2: '12',
  key: 'zvmn4p'
}], ['path', {
  d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  key: 'nb9nel'
}]]);
var Globe$1 = Globe;

var Grab = createReactComponent('Grab', [['path', {
  d: 'M18 11.5V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1.4',
  key: 'n5nng'
}], ['path', {
  d: 'M14 10V8a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2',
  key: '185i9d'
}], ['path', {
  d: 'M10 9.9V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5',
  key: '11pz95'
}], ['path', {
  d: 'M6 14v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0',
  key: '16yk7l'
}], ['path', {
  d: 'M18 11v0a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0',
  key: 'nzvb1c'
}]]);
var Grab$1 = Grab;

var GraduationCap = createReactComponent('GraduationCap', [['path', {
  d: 'M22 10v6M2 10l10-5 10 5-10 5z',
  key: '1ef52a'
}], ['path', {
  d: 'M6 12v5c3 3 9 3 12 0v-5',
  key: '1f75yj'
}]]);
var GraduationCap$1 = GraduationCap;

var Grape = createReactComponent('Grape', [['path', {
  d: 'M22 5V2l-5.89 5.89',
  key: '1eenpo'
}], ['circle', {
  cx: '16.6',
  cy: '15.89',
  r: '3',
  key: 'xjtalx'
}], ['circle', {
  cx: '8.11',
  cy: '7.4',
  r: '3',
  key: 'u2fv6i'
}], ['circle', {
  cx: '12.35',
  cy: '11.65',
  r: '3',
  key: 'i6i8g7'
}], ['circle', {
  cx: '13.91',
  cy: '5.85',
  r: '3',
  key: '6ye0dv'
}], ['circle', {
  cx: '18.15',
  cy: '10.09',
  r: '3',
  key: 'snx9no'
}], ['circle', {
  cx: '6.56',
  cy: '13.2',
  r: '3',
  key: '17x4xg'
}], ['circle', {
  cx: '10.8',
  cy: '17.44',
  r: '3',
  key: '1hogw9'
}], ['circle', {
  cx: '5',
  cy: '19',
  r: '3',
  key: '1sn6vo'
}]]);
var Grape$1 = Grape;

var Grid = createReactComponent('Grid', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['line', {
  x1: '3',
  y1: '9',
  x2: '21',
  y2: '9',
  key: '1uch6j'
}], ['line', {
  x1: '3',
  y1: '15',
  x2: '21',
  y2: '15',
  key: '1xojw2'
}], ['line', {
  x1: '9',
  y1: '3',
  x2: '9',
  y2: '21',
  key: 'nvcl17'
}], ['line', {
  x1: '15',
  y1: '3',
  x2: '15',
  y2: '21',
  key: 'jcv93v'
}]]);
var Grid$1 = Grid;

var GripHorizontal = createReactComponent('GripHorizontal', [['circle', {
  cx: '12',
  cy: '9',
  r: '1',
  key: '124mty'
}], ['circle', {
  cx: '19',
  cy: '9',
  r: '1',
  key: '1ruzo2'
}], ['circle', {
  cx: '5',
  cy: '9',
  r: '1',
  key: '1a8b28'
}], ['circle', {
  cx: '12',
  cy: '15',
  r: '1',
  key: '1e56xg'
}], ['circle', {
  cx: '19',
  cy: '15',
  r: '1',
  key: '1a92ep'
}], ['circle', {
  cx: '5',
  cy: '15',
  r: '1',
  key: '5r1jwy'
}]]);
var GripHorizontal$1 = GripHorizontal;

var GripVertical = createReactComponent('GripVertical', [['circle', {
  cx: '9',
  cy: '12',
  r: '1',
  key: '1vctgf'
}], ['circle', {
  cx: '9',
  cy: '5',
  r: '1',
  key: 'hp0tcf'
}], ['circle', {
  cx: '9',
  cy: '19',
  r: '1',
  key: 'fkjjf6'
}], ['circle', {
  cx: '15',
  cy: '12',
  r: '1',
  key: '1tmaij'
}], ['circle', {
  cx: '15',
  cy: '5',
  r: '1',
  key: '19l28e'
}], ['circle', {
  cx: '15',
  cy: '19',
  r: '1',
  key: 'f4zoj3'
}]]);
var GripVertical$1 = GripVertical;

var Hammer = createReactComponent('Hammer', [['path', {
  d: 'm15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9',
  key: '1afvon'
}], ['path', {
  d: 'M17.64 15 22 10.64',
  key: 'zsji6s'
}], ['path', {
  d: 'm20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91',
  key: 'lehyy1'
}]]);
var Hammer$1 = Hammer;

var HandMetal = createReactComponent('HandMetal', [['path', {
  d: 'M18 12.5V10a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1.4',
  key: '7eki13'
}], ['path', {
  d: 'M14 11V9a2 2 0 1 0-4 0v2',
  key: '94qvcw'
}], ['path', {
  d: 'M10 10.5V5a2 2 0 1 0-4 0v9',
  key: 'm1ah89'
}], ['path', {
  d: 'm7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6C7.5 21.14 9.2 22 12 22h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v5',
  key: 't1skq1'
}]]);
var HandMetal$1 = HandMetal;

var Hand = createReactComponent('Hand', [['path', {
  d: 'M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0',
  key: 'aigmz7'
}], ['path', {
  d: 'M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2',
  key: '1n6bmn'
}], ['path', {
  d: 'M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8',
  key: 'a9iiix'
}], ['path', {
  d: 'M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15',
  key: '1s1gnw'
}]]);
var Hand$1 = Hand;

var HardDrive = createReactComponent('HardDrive', [['line', {
  x1: '22',
  y1: '12',
  x2: '2',
  y2: '12',
  key: '3mrjqx'
}], ['path', {
  d: 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
  key: 'oot6mr'
}], ['line', {
  x1: '6',
  y1: '16',
  x2: '6.01',
  y2: '16',
  key: '17k2t0'
}], ['line', {
  x1: '10',
  y1: '16',
  x2: '10.01',
  y2: '16',
  key: '1oplzg'
}]]);
var HardDrive$1 = HardDrive;

var HardHat = createReactComponent('HardHat', [['path', {
  d: 'M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z',
  key: '1dej2m'
}], ['path', {
  d: 'M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5',
  key: '1p9q5i'
}], ['path', {
  d: 'M4 15v-3a6 6 0 0 1 6-6h0',
  key: '1uc279'
}], ['path', {
  d: 'M14 6h0a6 6 0 0 1 6 6v3',
  key: '1j9mnm'
}]]);
var HardHat$1 = HardHat;

var Hash = createReactComponent('Hash', [['line', {
  x1: '4',
  y1: '9',
  x2: '20',
  y2: '9',
  key: 'vg9vz1'
}], ['line', {
  x1: '4',
  y1: '15',
  x2: '20',
  y2: '15',
  key: '12vs86'
}], ['line', {
  x1: '10',
  y1: '3',
  x2: '8',
  y2: '21',
  key: '18wc2u'
}], ['line', {
  x1: '16',
  y1: '3',
  x2: '14',
  y2: '21',
  key: 'ohqwl5'
}]]);
var Hash$1 = Hash;

var Haze = createReactComponent('Haze', [['path', {
  d: 'm5.2 6.2 1.4 1.4',
  key: '17imol'
}], ['path', {
  d: 'M2 13h2',
  key: '13gyu8'
}], ['path', {
  d: 'M20 13h2',
  key: '16rner'
}], ['path', {
  d: 'm17.4 7.6 1.4-1.4',
  key: 't4xlah'
}], ['path', {
  d: 'M22 17H2',
  key: '1gtaj3'
}], ['path', {
  d: 'M22 21H2',
  key: '1gy6en'
}], ['path', {
  d: 'M16 13a4 4 0 0 0-8 0',
  key: '1dyczq'
}], ['path', {
  d: 'M12 5V2.5',
  key: '1vytko'
}]]);
var Haze$1 = Haze;

var Headphones = createReactComponent('Headphones', [['path', {
  d: 'M3 18v-6a9 9 0 0 1 18 0v6',
  key: 'e2ovd'
}], ['path', {
  d: 'M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z',
  key: '110y4r'
}]]);
var Headphones$1 = Headphones;

var HeartCrack = createReactComponent('HeartCrack', [['path', {
  d: 'M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z',
  key: '3q7jk9'
}], ['path', {
  d: 'm12 13-1-1 2-2-3-2.5 2.77-2.92',
  key: '5oba2v'
}]]);
var HeartCrack$1 = HeartCrack;

var HeartHandshake = createReactComponent('HeartHandshake', [['path', {
  d: 'M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z',
  key: '3q7jk9'
}], ['path', {
  d: 'M12 5.36 8.87 8.5a2.13 2.13 0 0 0 0 3h0a2.13 2.13 0 0 0 3 0l2.26-2.21a3 3 0 0 1 4.22 0l2.4 2.4',
  key: 't2xyyg'
}], ['path', {
  d: 'm18 15-2-2',
  key: '60u0ii'
}], ['path', {
  d: 'm15 18-2-2',
  key: '6p76be'
}]]);
var HeartHandshake$1 = HeartHandshake;

var HeartOff = createReactComponent('HeartOff', [['path', {
  d: 'M4.12 4.107a5.4 5.4 0 0 0-.538.473C1.46 6.7 1.33 10.28 4 13l8 8 4.5-4.5',
  key: 'yskeks'
}], ['path', {
  d: 'M19.328 13.672 20 13c2.67-2.72 2.54-6.3.42-8.42a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-2.386-1.393',
  key: '1340qr'
}], ['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}]]);
var HeartOff$1 = HeartOff;

var HeartPulse = createReactComponent('HeartPulse', [['path', {
  d: 'M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z',
  key: '3q7jk9'
}], ['path', {
  d: 'M3.5 12h6l.5-1 2 4.5 2-7 1.5 3.5h5',
  key: 'rc0z4z'
}]]);
var HeartPulse$1 = HeartPulse;

var Heart = createReactComponent('Heart', [['path', {
  d: 'M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z',
  key: '3q7jk9'
}]]);
var Heart$1 = Heart;

var HelpCircle = createReactComponent('HelpCircle', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['path', {
  d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3',
  key: '1u773s'
}], ['line', {
  x1: '12',
  y1: '17',
  x2: '12.01',
  y2: '17',
  key: 'kdstpg'
}]]);
var HelpCircle$1 = HelpCircle;

var Hexagon = createReactComponent('Hexagon', [['path', {
  d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  key: 'yt0hxn'
}]]);
var Hexagon$1 = Hexagon;

var Highlighter = createReactComponent('Highlighter', [['path', {
  d: 'm9 11-6 6v3h9l3-3',
  key: '1a3l36'
}], ['path', {
  d: 'm22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4',
  key: '14a9rk'
}]]);
var Highlighter$1 = Highlighter;

var History = createReactComponent('History', [['path', {
  d: 'M3 3v5h5',
  key: '1xhq8a'
}], ['path', {
  d: 'M3.05 13A9 9 0 1 0 6 5.3L3 8',
  key: '1xoms2'
}], ['path', {
  d: 'M12 7v5l4 2',
  key: '1fdv2h'
}]]);
var History$1 = History;

var Home = createReactComponent('Home', [['path', {
  d: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  key: 'y5dka4'
}], ['polyline', {
  points: '9 22 9 12 15 12 15 22',
  key: 'e2us08'
}]]);
var Home$1 = Home;

var Hourglass = createReactComponent('Hourglass', [['path', {
  d: 'M5 22h14',
  key: 'ehvnwv'
}], ['path', {
  d: 'M5 2h14',
  key: 'pdyrp9'
}], ['path', {
  d: 'M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22',
  key: '1d314k'
}], ['path', {
  d: 'M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2',
  key: '1vvvr6'
}]]);
var Hourglass$1 = Hourglass;

var IceCream = createReactComponent('IceCream', [['path', {
  d: 'm7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11',
  key: '1v6356'
}], ['path', {
  d: 'M17 7A5 5 0 0 0 7 7',
  key: '151p3v'
}], ['path', {
  d: 'M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4',
  key: '1sdaij'
}]]);
var IceCream$1 = IceCream;

var ImageMinus = createReactComponent('ImageMinus', [['path', {
  d: 'M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7',
  key: 'm87ecr'
}], ['line', {
  x1: '16',
  y1: '5',
  x2: '22',
  y2: '5',
  key: 'c5ve4s'
}], ['circle', {
  cx: '9',
  cy: '9',
  r: '2',
  key: 'af1f0g'
}], ['path', {
  d: 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21',
  key: '1xmnt7'
}]]);
var ImageMinus$1 = ImageMinus;

var ImageOff = createReactComponent('ImageOff', [['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}], ['path', {
  d: 'M10.41 10.41a2 2 0 1 1-2.83-2.83',
  key: '1bzlo9'
}], ['line', {
  x1: '13.5',
  y1: '13.5',
  x2: '6',
  y2: '21',
  key: '1oc4ns'
}], ['line', {
  x1: '18',
  y1: '12',
  x2: '21',
  y2: '15',
  key: '1j50dh'
}], ['path', {
  d: 'M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59',
  key: 'mmje98'
}], ['path', {
  d: 'M21 15V5a2 2 0 0 0-2-2H9',
  key: '43el77'
}]]);
var ImageOff$1 = ImageOff;

var ImagePlus = createReactComponent('ImagePlus', [['path', {
  d: 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7',
  key: '31hg93'
}], ['line', {
  x1: '16',
  y1: '5',
  x2: '22',
  y2: '5',
  key: 'c5ve4s'
}], ['line', {
  x1: '19',
  y1: '2',
  x2: '19',
  y2: '8',
  key: '12oc9j'
}], ['circle', {
  cx: '9',
  cy: '9',
  r: '2',
  key: 'af1f0g'
}], ['path', {
  d: 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21',
  key: '1xmnt7'
}]]);
var ImagePlus$1 = ImagePlus;

var Image = createReactComponent('Image', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['circle', {
  cx: '9',
  cy: '9',
  r: '2',
  key: 'af1f0g'
}], ['path', {
  d: 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21',
  key: '1xmnt7'
}]]);
var Image$1 = Image;

var Import = createReactComponent('Import', [['path', {
  d: 'M12 3v12',
  key: '1x0j5s'
}], ['path', {
  d: 'm8 11 4 4 4-4',
  key: '1dohi6'
}], ['path', {
  d: 'M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4',
  key: '1ywtjm'
}]]);
var Import$1 = Import;

var Inbox = createReactComponent('Inbox', [['polyline', {
  points: '22 12 16 12 14 15 10 15 8 12 2 12',
  key: 'o97t9d'
}], ['path', {
  d: 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
  key: 'oot6mr'
}]]);
var Inbox$1 = Inbox;

var Indent = createReactComponent('Indent', [['polyline', {
  points: '3 8 7 12 3 16',
  key: 'f3rxhf'
}], ['line', {
  x1: '21',
  y1: '12',
  x2: '11',
  y2: '12',
  key: '1xy73i'
}], ['line', {
  x1: '21',
  y1: '6',
  x2: '11',
  y2: '6',
  key: '97xvqg'
}], ['line', {
  x1: '21',
  y1: '18',
  x2: '11',
  y2: '18',
  key: '1r7j8g'
}]]);
var Indent$1 = Indent;

var IndianRupee = createReactComponent('IndianRupee', [['path', {
  d: 'M6 3h12',
  key: 'ggurg9'
}], ['path', {
  d: 'M6 8h12',
  key: '6g4wlu'
}], ['path', {
  d: 'm6 13 8.5 8',
  key: 'u1kupk'
}], ['path', {
  d: 'M6 13h3',
  key: 'wdp6ag'
}], ['path', {
  d: 'M9 13c6.667 0 6.667-10 0-10',
  key: '1nkvk2'
}]]);
var IndianRupee$1 = IndianRupee;

var Infinity = createReactComponent('Infinity', [['path', {
  d: 'M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z',
  key: '13d65y'
}]]);
var Infinity$1 = Infinity;

var Info = createReactComponent('Info', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['line', {
  x1: '12',
  y1: '16',
  x2: '12',
  y2: '12',
  key: 'dkqlv3'
}], ['line', {
  x1: '12',
  y1: '8',
  x2: '12.01',
  y2: '8',
  key: '1kl4hv'
}]]);
var Info$1 = Info;

var Inspect = createReactComponent('Inspect', [['path', {
  d: 'M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6',
  key: '14rsvq'
}], ['path', {
  d: 'm12 12 4 10 1.7-4.3L22 16Z',
  key: '64ilsv'
}]]);
var Inspect$1 = Inspect;

var Instagram = createReactComponent('Instagram', [['rect', {
  x: '2',
  y: '2',
  width: '20',
  height: '20',
  rx: '5',
  ry: '5',
  key: 'cdfzoc'
}], ['path', {
  d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z',
  key: '9exkf1'
}], ['line', {
  x1: '17.5',
  y1: '6.5',
  x2: '17.51',
  y2: '6.5',
  key: '643fve'
}]]);
var Instagram$1 = Instagram;

var Italic = createReactComponent('Italic', [['line', {
  x1: '19',
  y1: '4',
  x2: '10',
  y2: '4',
  key: 'ohvhe'
}], ['line', {
  x1: '14',
  y1: '20',
  x2: '5',
  y2: '20',
  key: 'pl6qj'
}], ['line', {
  x1: '15',
  y1: '4',
  x2: '9',
  y2: '20',
  key: 'baf5vk'
}]]);
var Italic$1 = Italic;

var JapaneseYen = createReactComponent('JapaneseYen', [['path', {
  d: 'M12 9.5V21m0-11.5L6 3m6 6.5L18 3',
  key: '2ej80x'
}], ['path', {
  d: 'M6 15h12',
  key: '1hwgt5'
}], ['path', {
  d: 'M6 11h12',
  key: 'wf4gp6'
}]]);
var JapaneseYen$1 = JapaneseYen;

var Joystick = createReactComponent('Joystick', [['path', {
  d: 'M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z',
  key: 'jg2n2t'
}], ['path', {
  d: 'M6 15v-2',
  key: 'gd6mvg'
}], ['path', {
  d: 'M12 15V9',
  key: '8c7uyn'
}], ['circle', {
  cx: '12',
  cy: '6',
  r: '3',
  key: '1gm2ql'
}]]);
var Joystick$1 = Joystick;

var Key = createReactComponent('Key', [['path', {
  d: 'm21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4',
  key: '1b7wfm'
}]]);
var Key$1 = Key;

var Keyboard = createReactComponent('Keyboard', [['rect', {
  x: '2',
  y: '4',
  width: '20',
  height: '16',
  rx: '2',
  ry: '2',
  key: 'xgg3gf'
}], ['path', {
  d: 'M6 8h.001',
  key: '1ej0i3'
}], ['path', {
  d: 'M10 8h.001',
  key: '1x2st2'
}], ['path', {
  d: 'M14 8h.001',
  key: '1vkmyp'
}], ['path', {
  d: 'M18 8h.001',
  key: 'kfsenl'
}], ['path', {
  d: 'M8 12h.001',
  key: '1sjpby'
}], ['path', {
  d: 'M12 12h.001',
  key: 'al75ts'
}], ['path', {
  d: 'M16 12h.001',
  key: '931bgk'
}], ['path', {
  d: 'M7 16h10',
  key: 'wp8him'
}]]);
var Keyboard$1 = Keyboard;

var LampCeiling = createReactComponent('LampCeiling', [['path', {
  d: 'M12 2v5',
  key: 'nd4vlx'
}], ['path', {
  d: 'M6 7h12l4 9H2l4-9Z',
  key: '123d64'
}], ['path', {
  d: 'M9.17 16a3 3 0 1 0 5.66 0',
  key: '1061mw'
}]]);
var LampCeiling$1 = LampCeiling;

var LampDesk = createReactComponent('LampDesk', [['path', {
  d: 'm14 5-3 3 2 7 8-8-7-2Z',
  key: '1b0msb'
}], ['path', {
  d: 'm14 5-3 3-3-3 3-3 3 3Z',
  key: '1uemms'
}], ['path', {
  d: 'M9.5 6.5 4 12l3 6',
  key: '1bx08v'
}], ['path', {
  d: 'M3 22v-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H3Z',
  key: 'wap775'
}]]);
var LampDesk$1 = LampDesk;

var LampFloor = createReactComponent('LampFloor', [['path', {
  d: 'M9 2h6l3 7H6l3-7Z',
  key: 'wcx6mj'
}], ['path', {
  d: 'M12 9v13',
  key: '3n1su1'
}], ['path', {
  d: 'M9 22h6',
  key: '1rlq3v'
}]]);
var LampFloor$1 = LampFloor;

var LampWallDown = createReactComponent('LampWallDown', [['path', {
  d: 'M11 13h6l3 7H8l3-7Z',
  key: '9n3qlo'
}], ['path', {
  d: 'M14 13V8a2 2 0 0 0-2-2H8',
  key: '1hu4hb'
}], ['path', {
  d: 'M4 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4v6Z',
  key: 's053bc'
}]]);
var LampWallDown$1 = LampWallDown;

var LampWallUp = createReactComponent('LampWallUp', [['path', {
  d: 'M11 4h6l3 7H8l3-7Z',
  key: '11x1ee'
}], ['path', {
  d: 'M14 11v5a2 2 0 0 1-2 2H8',
  key: 'eutp5o'
}], ['path', {
  d: 'M4 15h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4v-6Z',
  key: '1iuthr'
}]]);
var LampWallUp$1 = LampWallUp;

var Lamp = createReactComponent('Lamp', [['path', {
  d: 'M8 2h8l4 10H4L8 2Z',
  key: '9dma5w'
}], ['path', {
  d: 'M12 12v6',
  key: '3ahymv'
}], ['path', {
  d: 'M8 22v-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H8Z',
  key: 'mwf4oh'
}]]);
var Lamp$1 = Lamp;

var Landmark = createReactComponent('Landmark', [['line', {
  x1: '3',
  y1: '22',
  x2: '21',
  y2: '22',
  key: '1mkv49'
}], ['line', {
  x1: '6',
  y1: '18',
  x2: '6',
  y2: '11',
  key: 'shpxqa'
}], ['line', {
  x1: '10',
  y1: '18',
  x2: '10',
  y2: '11',
  key: '6quq76'
}], ['line', {
  x1: '14',
  y1: '18',
  x2: '14',
  y2: '11',
  key: 'qxd7vm'
}], ['line', {
  x1: '18',
  y1: '18',
  x2: '18',
  y2: '11',
  key: '1m478d'
}], ['polygon', {
  points: '12 2 20 7 4 7',
  key: 'jkujk7'
}]]);
var Landmark$1 = Landmark;

var Languages = createReactComponent('Languages', [['path', {
  d: 'm5 8 6 6',
  key: '1wu5hv'
}], ['path', {
  d: 'm4 14 6-6 2-3',
  key: '1k1g8d'
}], ['path', {
  d: 'M2 5h12',
  key: 'or177f'
}], ['path', {
  d: 'M7 2h1',
  key: '1t2jsx'
}], ['path', {
  d: 'm22 22-5-10-5 10',
  key: 'don7ne'
}], ['path', {
  d: 'M14 18h6',
  key: '1m8k6r'
}]]);
var Languages$1 = Languages;

var Laptop2 = createReactComponent('Laptop2', [['rect', {
  x: '3',
  y: '4',
  width: '18',
  height: '12',
  rx: '2',
  ry: '2',
  key: '8tl1gx'
}], ['line', {
  x1: '2',
  y1: '20',
  x2: '22',
  y2: '20',
  key: '1pxzem'
}]]);
var Laptop2$1 = Laptop2;

var Laptop = createReactComponent('Laptop', [['path', {
  d: 'M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16',
  key: 'tarvll'
}]]);
var Laptop$1 = Laptop;

var LassoSelect = createReactComponent('LassoSelect', [['path', {
  d: 'M7 22a5 5 0 0 1-2-4',
  key: 'umushi'
}], ['path', {
  d: 'M7 16.93c.96.43 1.96.74 2.99.91',
  key: 'ybbtv3'
}], ['path', {
  d: 'M3.34 14A6.8 6.8 0 0 1 2 10c0-4.42 4.48-8 10-8s10 3.58 10 8a7.19 7.19 0 0 1-.33 2',
  key: 'gt5e1w'
}], ['path', {
  d: 'M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  key: 'bq3ynw'
}], ['path', {
  d: 'M14.33 22h-.09a.35.35 0 0 1-.24-.32v-10a.34.34 0 0 1 .33-.34c.08 0 .15.03.21.08l7.34 6a.33.33 0 0 1-.21.59h-4.49l-2.57 3.85a.35.35 0 0 1-.28.14v0z',
  key: '1bawls'
}]]);
var LassoSelect$1 = LassoSelect;

var Lasso = createReactComponent('Lasso', [['path', {
  d: 'M7 22a5 5 0 0 1-2-4',
  key: 'umushi'
}], ['path', {
  d: 'M3.3 14A6.8 6.8 0 0 1 2 10c0-4.4 4.5-8 10-8s10 3.6 10 8-4.5 8-10 8a12 12 0 0 1-5-1',
  key: '146dds'
}], ['path', {
  d: 'M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  key: 'bq3ynw'
}]]);
var Lasso$1 = Lasso;

var Laugh = createReactComponent('Laugh', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['path', {
  d: 'M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z',
  key: 'b2q4dd'
}], ['line', {
  x1: '9',
  y1: '9',
  x2: '9.01',
  y2: '9',
  key: '141aaf'
}], ['line', {
  x1: '15',
  y1: '9',
  x2: '15.01',
  y2: '9',
  key: '1cyg3o'
}]]);
var Laugh$1 = Laugh;

var Layers = createReactComponent('Layers', [['polygon', {
  points: '12 2 2 7 12 12 22 7 12 2',
  key: '1b0ttc'
}], ['polyline', {
  points: '2 17 12 22 22 17',
  key: 'imjtdl'
}], ['polyline', {
  points: '2 12 12 17 22 12',
  key: '5dexcv'
}]]);
var Layers$1 = Layers;

var LayoutDashboard = createReactComponent('LayoutDashboard', [['rect', {
  x: '3',
  y: '3',
  width: '7',
  height: '9',
  key: '1eurd7'
}], ['rect', {
  x: '14',
  y: '3',
  width: '7',
  height: '5',
  key: 'zff5ux'
}], ['rect', {
  x: '14',
  y: '12',
  width: '7',
  height: '9',
  key: '1oiq0r'
}], ['rect', {
  x: '3',
  y: '16',
  width: '7',
  height: '5',
  key: '1145ac'
}]]);
var LayoutDashboard$1 = LayoutDashboard;

var LayoutGrid = createReactComponent('LayoutGrid', [['rect', {
  x: '3',
  y: '3',
  width: '7',
  height: '7',
  key: '1q9d4d'
}], ['rect', {
  x: '14',
  y: '3',
  width: '7',
  height: '7',
  key: '1kofyi'
}], ['rect', {
  x: '14',
  y: '14',
  width: '7',
  height: '7',
  key: '18jxcw'
}], ['rect', {
  x: '3',
  y: '14',
  width: '7',
  height: '7',
  key: '1omegr'
}]]);
var LayoutGrid$1 = LayoutGrid;

var LayoutList = createReactComponent('LayoutList', [['rect', {
  x: '3',
  y: '14',
  width: '7',
  height: '7',
  key: '1omegr'
}], ['rect', {
  x: '3',
  y: '3',
  width: '7',
  height: '7',
  key: '1q9d4d'
}], ['line', {
  x1: '14',
  y1: '4',
  x2: '21',
  y2: '4',
  key: '1klf7b'
}], ['line', {
  x1: '14',
  y1: '9',
  x2: '21',
  y2: '9',
  key: '1kf9x0'
}], ['line', {
  x1: '14',
  y1: '15',
  x2: '21',
  y2: '15',
  key: 's6i7v1'
}], ['line', {
  x1: '14',
  y1: '20',
  x2: '21',
  y2: '20',
  key: 'yxpbil'
}]]);
var LayoutList$1 = LayoutList;

var LayoutTemplate = createReactComponent('LayoutTemplate', [['path', {
  d: 'M21 3H3v7h18V3z',
  key: 'cq2tmr'
}], ['path', {
  d: 'M21 14h-5v7h5v-7z',
  key: '1dv32i'
}], ['path', {
  d: 'M12 14H3v7h9v-7z',
  key: '1k92lm'
}]]);
var LayoutTemplate$1 = LayoutTemplate;

var Layout = createReactComponent('Layout', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['line', {
  x1: '3',
  y1: '9',
  x2: '21',
  y2: '9',
  key: '1uch6j'
}], ['line', {
  x1: '9',
  y1: '21',
  x2: '9',
  y2: '9',
  key: '97zt75'
}]]);
var Layout$1 = Layout;

var Leaf = createReactComponent('Leaf', [['path', {
  d: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z',
  key: 'nnexq3'
}], ['path', {
  d: 'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
  key: 'mt58a7'
}]]);
var Leaf$1 = Leaf;

var Library = createReactComponent('Library', [['path', {
  d: 'm16 6 4 14',
  key: 'ji33uf'
}], ['path', {
  d: 'M12 6v14',
  key: '1n7gus'
}], ['path', {
  d: 'M8 8v12',
  key: '1gg7y9'
}], ['path', {
  d: 'M4 4v16',
  key: '6qkkli'
}]]);
var Library$1 = Library;

var LifeBuoy = createReactComponent('LifeBuoy', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '4',
  key: '4exip2'
}], ['line', {
  x1: '4.93',
  y1: '4.93',
  x2: '9.17',
  y2: '9.17',
  key: '1akcti'
}], ['line', {
  x1: '14.83',
  y1: '14.83',
  x2: '19.07',
  y2: '19.07',
  key: 'js56sr'
}], ['line', {
  x1: '14.83',
  y1: '9.17',
  x2: '19.07',
  y2: '4.93',
  key: 'ca9a8b'
}], ['line', {
  x1: '14.83',
  y1: '9.17',
  x2: '18.36',
  y2: '5.64',
  key: 'dsbuwx'
}], ['line', {
  x1: '4.93',
  y1: '19.07',
  x2: '9.17',
  y2: '14.83',
  key: '1lkv3n'
}]]);
var LifeBuoy$1 = LifeBuoy;

var LightbulbOff = createReactComponent('LightbulbOff', [['path', {
  d: 'M9 18h6',
  key: 'x1upvd'
}], ['path', {
  d: 'M10 22h4',
  key: 'ceow96'
}], ['path', {
  d: 'm2 2 20 20',
  key: '1ooewy'
}], ['path', {
  d: 'M9 2.804A6 6 0 0 1 18 8a4.65 4.65 0 0 1-1.03 3',
  key: '1v6krz'
}], ['path', {
  d: 'M8.91 14a4.61 4.61 0 0 0-1.41-2.5C6.23 10.23 6 9 6 8a6 6 0 0 1 .084-1',
  key: '1jxmct'
}]]);
var LightbulbOff$1 = LightbulbOff;

var Lightbulb = createReactComponent('Lightbulb', [['line', {
  x1: '9',
  y1: '18',
  x2: '15',
  y2: '18',
  key: 'poumom'
}], ['line', {
  x1: '10',
  y1: '22',
  x2: '14',
  y2: '22',
  key: '1oekqc'
}], ['path', {
  d: 'M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14',
  key: 'a9yf0y'
}]]);
var Lightbulb$1 = Lightbulb;

var LineChart = createReactComponent('LineChart', [['path', {
  d: 'M3 3v18h18',
  key: '1s2lah'
}], ['path', {
  d: 'm19 9-5 5-4-4-3 3',
  key: '2osh9i'
}]]);
var LineChart$1 = LineChart;

var Link2Off = createReactComponent('Link2Off', [['path', {
  d: 'M9 17H7A5 5 0 0 1 7 7',
  key: '10o201'
}], ['path', {
  d: 'M15 7h2a5 5 0 0 1 4 8',
  key: '1d3206'
}], ['line', {
  x1: '8',
  y1: '12',
  x2: '12',
  y2: '12',
  key: '1drbw0'
}], ['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}]]);
var Link2Off$1 = Link2Off;

var Link2 = createReactComponent('Link2', [['path', {
  d: 'M9 17H7A5 5 0 0 1 7 7h2',
  key: '8i5ue5'
}], ['path', {
  d: 'M15 7h2a5 5 0 1 1 0 10h-2',
  key: '1b9ql8'
}], ['line', {
  x1: '8',
  y1: '12',
  x2: '16',
  y2: '12',
  key: '1myapg'
}]]);
var Link2$1 = Link2;

var Link = createReactComponent('Link', [['path', {
  d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
  key: '1cjeqo'
}], ['path', {
  d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  key: '19qd67'
}]]);
var Link$1 = Link;

var Linkedin = createReactComponent('Linkedin', [['path', {
  d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z',
  key: 'c2jq9f'
}], ['rect', {
  x: '2',
  y: '9',
  width: '4',
  height: '12',
  key: 'fu1a4h'
}], ['circle', {
  cx: '4',
  cy: '4',
  r: '2',
  key: 'bt5ra8'
}]]);
var Linkedin$1 = Linkedin;

var ListChecks = createReactComponent('ListChecks', [['line', {
  x1: '10',
  y1: '6',
  x2: '21',
  y2: '6',
  key: 'g7ikjt'
}], ['line', {
  x1: '10',
  y1: '12',
  x2: '21',
  y2: '12',
  key: 'xgqux5'
}], ['line', {
  x1: '10',
  y1: '18',
  x2: '21',
  y2: '18',
  key: '1q4fbe'
}], ['polyline', {
  points: '3 6 4 7 6 5',
  key: 'ectua5'
}], ['polyline', {
  points: '3 12 4 13 6 11',
  key: 'gtbhyw'
}], ['polyline', {
  points: '3 18 4 19 6 17',
  key: 'qzp18e'
}]]);
var ListChecks$1 = ListChecks;

var ListEnd = createReactComponent('ListEnd', [['path', {
  d: 'M16 12H3',
  key: '1a2rj7'
}], ['path', {
  d: 'M16 6H3',
  key: '1wxfjs'
}], ['path', {
  d: 'M10 18H3',
  key: '13769t'
}], ['path', {
  d: 'M21 6v10a2 2 0 0 1-2 2h-4',
  key: '1snekz'
}], ['path', {
  d: 'm16 16-2 2 2 2',
  key: 'kkc6pm'
}]]);
var ListEnd$1 = ListEnd;

var ListMinus = createReactComponent('ListMinus', [['path', {
  d: 'M11 12H3',
  key: '51ecnj'
}], ['path', {
  d: 'M16 6H3',
  key: '1wxfjs'
}], ['path', {
  d: 'M16 18H3',
  key: '12xzn7'
}], ['path', {
  d: 'M21 12h-6',
  key: 'bt1uis'
}]]);
var ListMinus$1 = ListMinus;

var ListMusic = createReactComponent('ListMusic', [['path', {
  d: 'M21 15V6',
  key: 'h1cx4g'
}], ['path', {
  d: 'M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  key: '8saifv'
}], ['path', {
  d: 'M12 12H3',
  key: '18klou'
}], ['path', {
  d: 'M16 6H3',
  key: '1wxfjs'
}], ['path', {
  d: 'M12 18H3',
  key: '11ftsu'
}]]);
var ListMusic$1 = ListMusic;

var ListOrdered = createReactComponent('ListOrdered', [['line', {
  x1: '10',
  y1: '6',
  x2: '21',
  y2: '6',
  key: 'g7ikjt'
}], ['line', {
  x1: '10',
  y1: '12',
  x2: '21',
  y2: '12',
  key: 'xgqux5'
}], ['line', {
  x1: '10',
  y1: '18',
  x2: '21',
  y2: '18',
  key: '1q4fbe'
}], ['path', {
  d: 'M4 6h1v4',
  key: 'cnovpq'
}], ['path', {
  d: 'M4 10h2',
  key: '16xx2s'
}], ['path', {
  d: 'M6 18H4c0-1 2-2 2-3s-1-1.5-2-1',
  key: 'm9a95d'
}]]);
var ListOrdered$1 = ListOrdered;

var ListPlus = createReactComponent('ListPlus', [['path', {
  d: 'M11 12H3',
  key: '51ecnj'
}], ['path', {
  d: 'M16 6H3',
  key: '1wxfjs'
}], ['path', {
  d: 'M16 18H3',
  key: '12xzn7'
}], ['path', {
  d: 'M18 9v6',
  key: '1twb98'
}], ['path', {
  d: 'M21 12h-6',
  key: 'bt1uis'
}]]);
var ListPlus$1 = ListPlus;

var ListStart = createReactComponent('ListStart', [['path', {
  d: 'M16 12H3',
  key: '1a2rj7'
}], ['path', {
  d: 'M16 18H3',
  key: '12xzn7'
}], ['path', {
  d: 'M10 6H3',
  key: 'lf8lx7'
}], ['path', {
  d: 'M21 18V8a2 2 0 0 0-2-2h-5',
  key: '1hghli'
}], ['path', {
  d: 'm16 8-2-2 2-2',
  key: '160uvd'
}]]);
var ListStart$1 = ListStart;

var ListVideo = createReactComponent('ListVideo', [['path', {
  d: 'M12 12H3',
  key: '18klou'
}], ['path', {
  d: 'M16 6H3',
  key: '1wxfjs'
}], ['path', {
  d: 'M12 18H3',
  key: '11ftsu'
}], ['path', {
  d: 'm16 12 5 3-5 3v-6Z',
  key: 'zpskkp'
}]]);
var ListVideo$1 = ListVideo;

var ListX = createReactComponent('ListX', [['path', {
  d: 'M11 12H3',
  key: '51ecnj'
}], ['path', {
  d: 'M16 6H3',
  key: '1wxfjs'
}], ['path', {
  d: 'M16 18H3',
  key: '12xzn7'
}], ['path', {
  d: 'm19 10-4 4',
  key: '1tz659'
}], ['path', {
  d: 'm15 10 4 4',
  key: '1n7nei'
}]]);
var ListX$1 = ListX;

var List = createReactComponent('List', [['line', {
  x1: '8',
  y1: '6',
  x2: '21',
  y2: '6',
  key: '1kveod'
}], ['line', {
  x1: '8',
  y1: '12',
  x2: '21',
  y2: '12',
  key: '120u6p'
}], ['line', {
  x1: '8',
  y1: '18',
  x2: '21',
  y2: '18',
  key: '1k409v'
}], ['line', {
  x1: '3',
  y1: '6',
  x2: '3.01',
  y2: '6',
  key: '13co06'
}], ['line', {
  x1: '3',
  y1: '12',
  x2: '3.01',
  y2: '12',
  key: '11tec3'
}], ['line', {
  x1: '3',
  y1: '18',
  x2: '3.01',
  y2: '18',
  key: '14wug1'
}]]);
var List$1 = List;

var Loader2 = createReactComponent('Loader2', [['path', {
  d: 'M21 12a9 9 0 1 1-6.219-8.56',
  key: '13zald'
}]]);
var Loader2$1 = Loader2;

var Loader = createReactComponent('Loader', [['line', {
  x1: '12',
  y1: '2',
  x2: '12',
  y2: '6',
  key: '1pduqs'
}], ['line', {
  x1: '12',
  y1: '18',
  x2: '12',
  y2: '22',
  key: '1b94uv'
}], ['line', {
  x1: '4.93',
  y1: '4.93',
  x2: '7.76',
  y2: '7.76',
  key: '1a736z'
}], ['line', {
  x1: '16.24',
  y1: '16.24',
  x2: '19.07',
  y2: '19.07',
  key: 'gt096z'
}], ['line', {
  x1: '2',
  y1: '12',
  x2: '6',
  y2: '12',
  key: 'rkbu33'
}], ['line', {
  x1: '18',
  y1: '12',
  x2: '22',
  y2: '12',
  key: '1vrbnu'
}], ['line', {
  x1: '4.93',
  y1: '19.07',
  x2: '7.76',
  y2: '16.24',
  key: '59c6el'
}], ['line', {
  x1: '16.24',
  y1: '7.76',
  x2: '19.07',
  y2: '4.93',
  key: '8m03gt'
}]]);
var Loader$1 = Loader;

var LocateFixed = createReactComponent('LocateFixed', [['line', {
  x1: '2',
  x2: '5',
  y1: '12',
  y2: '12',
  key: 'bvdh0s'
}], ['line', {
  x1: '19',
  x2: '22',
  y1: '12',
  y2: '12',
  key: '1tbv5k'
}], ['line', {
  x1: '12',
  x2: '12',
  y1: '2',
  y2: '5',
  key: '11lu5j'
}], ['line', {
  x1: '12',
  x2: '12',
  y1: '19',
  y2: '22',
  key: 'x3vr5v'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '7',
  key: 'fim9np'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '3',
  key: '1v7zrd'
}]]);
var LocateFixed$1 = LocateFixed;

var LocateOff = createReactComponent('LocateOff', [['line', {
  x1: '2',
  x2: '5',
  y1: '12',
  y2: '12',
  key: 'bvdh0s'
}], ['line', {
  x1: '19',
  x2: '22',
  y1: '12',
  y2: '12',
  key: '1tbv5k'
}], ['line', {
  x1: '12',
  x2: '12',
  y1: '2',
  y2: '5',
  key: '11lu5j'
}], ['line', {
  x1: '12',
  x2: '12',
  y1: '19',
  y2: '22',
  key: 'x3vr5v'
}], ['path', {
  d: 'M7.11 7.11C5.83 8.39 5 10.1 5 12c0 3.87 3.13 7 7 7 1.9 0 3.61-.83 4.89-2.11',
  key: '1oh7ia'
}], ['path', {
  d: 'M18.71 13.96c.19-.63.29-1.29.29-1.96 0-3.87-3.13-7-7-7-.67 0-1.33.1-1.96.29',
  key: '3qdecy'
}], ['line', {
  x1: '2',
  x2: '22',
  y1: '2',
  y2: '22',
  key: 'a6p6uj'
}]]);
var LocateOff$1 = LocateOff;

var Locate = createReactComponent('Locate', [['line', {
  x1: '2',
  x2: '5',
  y1: '12',
  y2: '12',
  key: 'bvdh0s'
}], ['line', {
  x1: '19',
  x2: '22',
  y1: '12',
  y2: '12',
  key: '1tbv5k'
}], ['line', {
  x1: '12',
  x2: '12',
  y1: '2',
  y2: '5',
  key: '11lu5j'
}], ['line', {
  x1: '12',
  x2: '12',
  y1: '19',
  y2: '22',
  key: 'x3vr5v'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '7',
  key: 'fim9np'
}]]);
var Locate$1 = Locate;

var Lock = createReactComponent('Lock', [['rect', {
  x: '3',
  y: '11',
  width: '18',
  height: '11',
  rx: '2',
  ry: '2',
  key: 'biyj2e'
}], ['path', {
  d: 'M7 11V7a5 5 0 0 1 10 0v4',
  key: 'fwvmzm'
}]]);
var Lock$1 = Lock;

var LogIn = createReactComponent('LogIn', [['path', {
  d: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4',
  key: 'u53s6r'
}], ['polyline', {
  points: '10 17 15 12 10 7',
  key: '1ail0h'
}], ['line', {
  x1: '15',
  y1: '12',
  x2: '3',
  y2: '12',
  key: '80e4vw'
}]]);
var LogIn$1 = LogIn;

var LogOut = createReactComponent('LogOut', [['path', {
  d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4',
  key: '1uf3rs'
}], ['polyline', {
  points: '16 17 21 12 16 7',
  key: '1gabdz'
}], ['line', {
  x1: '21',
  y1: '12',
  x2: '9',
  y2: '12',
  key: '1stwgr'
}]]);
var LogOut$1 = LogOut;

var Luggage = createReactComponent('Luggage', [['path', {
  d: 'M6 20h0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h0',
  key: '1h5fkc'
}], ['path', {
  d: 'M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14',
  key: '1l99gc'
}], ['path', {
  d: 'M10 20h4',
  key: 'ni2waw'
}], ['circle', {
  cx: '16',
  cy: '20',
  r: '2',
  key: '1vifvg'
}], ['circle', {
  cx: '8',
  cy: '20',
  r: '2',
  key: 'ckkr5m'
}]]);
var Luggage$1 = Luggage;

var Magnet = createReactComponent('Magnet', [['path', {
  d: 'm6 15-4-4 6.75-6.77a7.79 7.79 0 0 1 11 11L13 22l-4-4 6.39-6.36a2.14 2.14 0 0 0-3-3L6 15',
  key: '1i3lhw'
}], ['path', {
  d: 'm5 8 4 4',
  key: 'j6kj7e'
}], ['path', {
  d: 'm12 15 4 4',
  key: 'lnac28'
}]]);
var Magnet$1 = Magnet;

var MailCheck = createReactComponent('MailCheck', [['path', {
  d: 'M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8',
  key: '12jkf8'
}], ['path', {
  d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
  key: '1ocrg3'
}], ['path', {
  d: 'm16 19 2 2 4-4',
  key: '1b14m6'
}]]);
var MailCheck$1 = MailCheck;

var MailMinus = createReactComponent('MailMinus', [['path', {
  d: 'M22 15V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8',
  key: 'fuxbkv'
}], ['path', {
  d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
  key: '1ocrg3'
}], ['path', {
  d: 'M16 19h6',
  key: 'xwg31i'
}]]);
var MailMinus$1 = MailMinus;

var MailOpen = createReactComponent('MailOpen', [['path', {
  d: 'M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z',
  key: '1jhwl8'
}], ['path', {
  d: 'm22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10',
  key: '1qfld7'
}]]);
var MailOpen$1 = MailOpen;

var MailPlus = createReactComponent('MailPlus', [['path', {
  d: 'M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8',
  key: '12jkf8'
}], ['path', {
  d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
  key: '1ocrg3'
}], ['path', {
  d: 'M19 16v6',
  key: 'tddt3s'
}], ['path', {
  d: 'M16 19h6',
  key: 'xwg31i'
}]]);
var MailPlus$1 = MailPlus;

var MailQuestion = createReactComponent('MailQuestion', [['path', {
  d: 'M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5',
  key: 'e61zoh'
}], ['path', {
  d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
  key: '1ocrg3'
}], ['path', {
  d: 'M18 15.28c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2',
  key: '7z9rxb'
}], ['path', {
  d: 'M20 22v.01',
  key: '12bgn6'
}]]);
var MailQuestion$1 = MailQuestion;

var MailSearch = createReactComponent('MailSearch', [['path', {
  d: 'M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h7.5',
  key: 'w80f2v'
}], ['path', {
  d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
  key: '1ocrg3'
}], ['path', {
  d: 'M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6v0Z',
  key: 'mgbru4'
}], ['circle', {
  cx: '18',
  cy: '18',
  r: '3',
  key: '1xkwt0'
}], ['path', {
  d: 'm22 22-1.5-1.5',
  key: '1x83k4'
}]]);
var MailSearch$1 = MailSearch;

var MailWarning = createReactComponent('MailWarning', [['path', {
  d: 'M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5',
  key: 'e61zoh'
}], ['path', {
  d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
  key: '1ocrg3'
}], ['path', {
  d: 'M20 14v4',
  key: '1hm744'
}], ['path', {
  d: 'M20 22v.01',
  key: '12bgn6'
}]]);
var MailWarning$1 = MailWarning;

var MailX = createReactComponent('MailX', [['path', {
  d: 'M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9',
  key: '1j9vog'
}], ['path', {
  d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
  key: '1ocrg3'
}], ['path', {
  d: 'm17 17 4 4',
  key: '1b3523'
}], ['path', {
  d: 'm21 17-4 4',
  key: 'uinynz'
}]]);
var MailX$1 = MailX;

var Mail = createReactComponent('Mail', [['rect', {
  x: '2',
  y: '4',
  width: '20',
  height: '16',
  rx: '2',
  key: 'izxlao'
}], ['path', {
  d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
  key: '1ocrg3'
}]]);
var Mail$1 = Mail;

var Mails = createReactComponent('Mails', [['rect', {
  x: '6',
  y: '4',
  width: '16',
  height: '13',
  rx: '2',
  key: 'q6n4z8'
}], ['path', {
  d: 'm22 7-7.1 3.78c-.57.3-1.23.3-1.8 0L6 7',
  key: 'xn252p'
}], ['path', {
  d: 'M2 8v11c0 1.1.9 2 2 2h14',
  key: 'n13cji'
}]]);
var Mails$1 = Mails;

var MapPinOff = createReactComponent('MapPinOff', [['path', {
  d: 'M5.43 5.43A8.06 8.06 0 0 0 4 10c0 6 8 12 8 12a29.94 29.94 0 0 0 5-5',
  key: '12a8pk'
}], ['path', {
  d: 'M19.18 13.52A8.66 8.66 0 0 0 20 10a8 8 0 0 0-8-8 7.88 7.88 0 0 0-3.52.82',
  key: '1r9f6y'
}], ['path', {
  d: 'M9.13 9.13A2.78 2.78 0 0 0 9 10a3 3 0 0 0 3 3 2.78 2.78 0 0 0 .87-.13',
  key: 'erynq7'
}], ['path', {
  d: 'M14.9 9.25a3 3 0 0 0-2.15-2.16',
  key: '1hwwmx'
}], ['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}]]);
var MapPinOff$1 = MapPinOff;

var MapPin = createReactComponent('MapPin', [['path', {
  d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z',
  key: '2oe9fu'
}], ['circle', {
  cx: '12',
  cy: '10',
  r: '3',
  key: 'ilqhr7'
}]]);
var MapPin$1 = MapPin;

var Map = createReactComponent('Map', [['polygon', {
  points: '3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21',
  key: 'ok2ie8'
}], ['line', {
  x1: '9',
  y1: '3',
  x2: '9',
  y2: '18',
  key: '3zqglt'
}], ['line', {
  x1: '15',
  y1: '6',
  x2: '15',
  y2: '21',
  key: '1c9xoo'
}]]);
var Map$1 = Map;

var Martini = createReactComponent('Martini', [['path', {
  d: 'M8 22h8',
  key: 'rmew8v'
}], ['path', {
  d: 'M12 11v11',
  key: 'ur9y6a'
}], ['path', {
  d: 'm19 3-7 8-7-8Z',
  key: '1sgpiw'
}]]);
var Martini$1 = Martini;

var Maximize2 = createReactComponent('Maximize2', [['polyline', {
  points: '15 3 21 3 21 9',
  key: 'mznyad'
}], ['polyline', {
  points: '9 21 3 21 3 15',
  key: '1avn1i'
}], ['line', {
  x1: '21',
  y1: '3',
  x2: '14',
  y2: '10',
  key: '8isubj'
}], ['line', {
  x1: '3',
  y1: '21',
  x2: '10',
  y2: '14',
  key: 'c1a6xr'
}]]);
var Maximize2$1 = Maximize2;

var Maximize = createReactComponent('Maximize', [['path', {
  d: 'M8 3H5a2 2 0 0 0-2 2v3',
  key: '1dcmit'
}], ['path', {
  d: 'M21 8V5a2 2 0 0 0-2-2h-3',
  key: '1e4gt3'
}], ['path', {
  d: 'M3 16v3a2 2 0 0 0 2 2h3',
  key: 'wsl5sc'
}], ['path', {
  d: 'M16 21h3a2 2 0 0 0 2-2v-3',
  key: '18trek'
}]]);
var Maximize$1 = Maximize;

var Medal = createReactComponent('Medal', [['path', {
  d: 'M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15',
  key: '143lza'
}], ['path', {
  d: 'M11 12 5.12 2.2',
  key: 'qhuxz6'
}], ['path', {
  d: 'm13 12 5.88-9.8',
  key: 'hbye0f'
}], ['path', {
  d: 'M8 7h8',
  key: 'i86dvs'
}], ['circle', {
  cx: '12',
  cy: '17',
  r: '5',
  key: 'qbz8iq'
}], ['path', {
  d: 'M12 18v-2h-.5',
  key: 'fawc4q'
}]]);
var Medal$1 = Medal;

var MegaphoneOff = createReactComponent('MegaphoneOff', [['path', {
  d: 'M9.26 9.26 3 11v3l14.14 3.14',
  key: '3429n'
}], ['path', {
  d: 'M21 15.34V6l-7.31 2.03',
  key: '4o1dh8'
}], ['path', {
  d: 'M11.6 16.8a3 3 0 1 1-5.8-1.6',
  key: '1yl0tm'
}], ['line', {
  x1: '2',
  x2: '22',
  y1: '2',
  y2: '22',
  key: 'a6p6uj'
}]]);
var MegaphoneOff$1 = MegaphoneOff;

var Megaphone = createReactComponent('Megaphone', [['path', {
  d: 'm3 11 18-5v12L3 14v-3z',
  key: 'n962bs'
}], ['path', {
  d: 'M11.6 16.8a3 3 0 1 1-5.8-1.6',
  key: '1yl0tm'
}]]);
var Megaphone$1 = Megaphone;

var Meh = createReactComponent('Meh', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['line', {
  x1: '8',
  y1: '15',
  x2: '16',
  y2: '15',
  key: '29ieok'
}], ['line', {
  x1: '9',
  y1: '9',
  x2: '9.01',
  y2: '9',
  key: '141aaf'
}], ['line', {
  x1: '15',
  y1: '9',
  x2: '15.01',
  y2: '9',
  key: '1cyg3o'
}]]);
var Meh$1 = Meh;

var Menu = createReactComponent('Menu', [['line', {
  x1: '4',
  y1: '12',
  x2: '20',
  y2: '12',
  key: '1q6rtp'
}], ['line', {
  x1: '4',
  y1: '6',
  x2: '20',
  y2: '6',
  key: '1jr6gt'
}], ['line', {
  x1: '4',
  y1: '18',
  x2: '20',
  y2: '18',
  key: '98tuvx'
}]]);
var Menu$1 = Menu;

var MessageCircle = createReactComponent('MessageCircle', [['path', {
  d: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  key: '5iho0c'
}]]);
var MessageCircle$1 = MessageCircle;

var MessageSquare = createReactComponent('MessageSquare', [['path', {
  d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  key: '1lielz'
}]]);
var MessageSquare$1 = MessageSquare;

var Mic2 = createReactComponent('Mic2', [['path', {
  d: 'm12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12',
  key: 'zoua8r'
}], ['circle', {
  cx: '17',
  cy: '7',
  r: '5',
  key: '1fomce'
}]]);
var Mic2$1 = Mic2;

var MicOff = createReactComponent('MicOff', [['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}], ['path', {
  d: 'M18.89 13.23A7.12 7.12 0 0 0 19 12v-2',
  key: '80xlxr'
}], ['path', {
  d: 'M5 10v2a7 7 0 0 0 12 5',
  key: 'p2k8kg'
}], ['path', {
  d: 'M15 9.34V5a3 3 0 0 0-5.68-1.33',
  key: '1gzdoj'
}], ['path', {
  d: 'M9 9v3a3 3 0 0 0 5.12 2.12',
  key: 'r2i35w'
}], ['line', {
  x1: '12',
  y1: '19',
  x2: '12',
  y2: '22',
  key: '1l505v'
}]]);
var MicOff$1 = MicOff;

var Mic = createReactComponent('Mic', [['path', {
  d: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z',
  key: '131961'
}], ['path', {
  d: 'M19 10v2a7 7 0 0 1-14 0v-2',
  key: '1vc78b'
}], ['line', {
  x1: '12',
  y1: '19',
  x2: '12',
  y2: '22',
  key: '1l505v'
}]]);
var Mic$1 = Mic;

var Microscope = createReactComponent('Microscope', [['path', {
  d: 'M6 18h8',
  key: '1borvv'
}], ['path', {
  d: 'M3 22h18',
  key: '8prr45'
}], ['path', {
  d: 'M14 22a7 7 0 1 0 0-14h-1',
  key: '1jwaiy'
}], ['path', {
  d: 'M9 14h2',
  key: '197e7h'
}], ['path', {
  d: 'M8 6h4',
  key: 'i9thid'
}], ['path', {
  d: 'M13 10V6.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2.5a.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V10c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2Z',
  key: 'z62yqi'
}]]);
var Microscope$1 = Microscope;

var Microwave = createReactComponent('Microwave', [['rect', {
  x: '2',
  y: '4',
  width: '20',
  height: '15',
  rx: '2',
  key: '1rfv8z'
}], ['rect', {
  x: '6',
  y: '8',
  width: '8',
  height: '7',
  rx: '1',
  key: 'i43qc1'
}], ['path', {
  d: 'M18 8v7',
  key: 'o5zi4n'
}], ['path', {
  d: 'M6 19v2',
  key: '1loha6'
}], ['path', {
  d: 'M18 19v2',
  key: '1dawf0'
}]]);
var Microwave$1 = Microwave;

var Milestone = createReactComponent('Milestone', [['path', {
  d: 'M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z',
  key: '1mp5s7'
}], ['path', {
  d: 'M12 13v9',
  key: 'keea1l'
}], ['path', {
  d: 'M12 2v4',
  key: '3427ic'
}]]);
var Milestone$1 = Milestone;

var Minimize2 = createReactComponent('Minimize2', [['polyline', {
  points: '4 14 10 14 10 20',
  key: '11kfnr'
}], ['polyline', {
  points: '20 10 14 10 14 4',
  key: 'rlmsce'
}], ['line', {
  x1: '14',
  y1: '10',
  x2: '21',
  y2: '3',
  key: '6dvi8v'
}], ['line', {
  x1: '3',
  y1: '21',
  x2: '10',
  y2: '14',
  key: 'c1a6xr'
}]]);
var Minimize2$1 = Minimize2;

var Minimize = createReactComponent('Minimize', [['path', {
  d: 'M8 3v3a2 2 0 0 1-2 2H3',
  key: 'hohbtr'
}], ['path', {
  d: 'M21 8h-3a2 2 0 0 1-2-2V3',
  key: '5jw1f3'
}], ['path', {
  d: 'M3 16h3a2 2 0 0 1 2 2v3',
  key: '198tvr'
}], ['path', {
  d: 'M16 21v-3a2 2 0 0 1 2-2h3',
  key: 'ph8mxp'
}]]);
var Minimize$1 = Minimize;

var MinusCircle = createReactComponent('MinusCircle', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['line', {
  x1: '8',
  y1: '12',
  x2: '16',
  y2: '12',
  key: '1myapg'
}]]);
var MinusCircle$1 = MinusCircle;

var MinusSquare = createReactComponent('MinusSquare', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['line', {
  x1: '8',
  y1: '12',
  x2: '16',
  y2: '12',
  key: '1myapg'
}]]);
var MinusSquare$1 = MinusSquare;

var Minus = createReactComponent('Minus', [['line', {
  x1: '5',
  y1: '12',
  x2: '19',
  y2: '12',
  key: '1smlys'
}]]);
var Minus$1 = Minus;

var MonitorOff = createReactComponent('MonitorOff', [['path', {
  d: 'M17 17H4a2 2 0 0 1-2-2V5c0-1.5 1-2 1-2',
  key: 'k0q8oc'
}], ['path', {
  d: 'M22 15V5a2 2 0 0 0-2-2H9',
  key: 'cp1ac0'
}], ['path', {
  d: 'M8 21h8',
  key: '1ev6f3'
}], ['path', {
  d: 'M12 17v4',
  key: '1riwvh'
}], ['path', {
  d: 'm2 2 20 20',
  key: '1ooewy'
}]]);
var MonitorOff$1 = MonitorOff;

var MonitorSpeaker = createReactComponent('MonitorSpeaker', [['path', {
  d: 'M5.5 20H8',
  key: '1k40s5'
}], ['path', {
  d: 'M17 9h.01',
  key: '1j24nn'
}], ['rect', {
  x: '12',
  y: '4',
  width: '10',
  height: '16',
  rx: '2',
  key: '1gi0i2'
}], ['path', {
  d: 'M8 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4',
  key: '1mp6e1'
}], ['circle', {
  cx: '17',
  cy: '15',
  r: '1',
  key: 'tqvash'
}]]);
var MonitorSpeaker$1 = MonitorSpeaker;

var Monitor = createReactComponent('Monitor', [['rect', {
  x: '2',
  y: '3',
  width: '20',
  height: '14',
  rx: '2',
  ry: '2',
  key: '1q87ek'
}], ['line', {
  x1: '8',
  y1: '21',
  x2: '16',
  y2: '21',
  key: 'bcbiac'
}], ['line', {
  x1: '12',
  y1: '17',
  x2: '12',
  y2: '21',
  key: '1v4d7v'
}]]);
var Monitor$1 = Monitor;

var Moon = createReactComponent('Moon', [['path', {
  d: 'M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z',
  key: '1rit1i'
}]]);
var Moon$1 = Moon;

var MoreHorizontal = createReactComponent('MoreHorizontal', [['circle', {
  cx: '12',
  cy: '12',
  r: '1',
  key: '41hilf'
}], ['circle', {
  cx: '19',
  cy: '12',
  r: '1',
  key: '1wjl8i'
}], ['circle', {
  cx: '5',
  cy: '12',
  r: '1',
  key: '1pcz8c'
}]]);
var MoreHorizontal$1 = MoreHorizontal;

var MoreVertical = createReactComponent('MoreVertical', [['circle', {
  cx: '12',
  cy: '12',
  r: '1',
  key: '41hilf'
}], ['circle', {
  cx: '12',
  cy: '5',
  r: '1',
  key: 'gxeob9'
}], ['circle', {
  cx: '12',
  cy: '19',
  r: '1',
  key: 'lyex9k'
}]]);
var MoreVertical$1 = MoreVertical;

var MountainSnow = createReactComponent('MountainSnow', [['path', {
  d: 'm8 3 4 8 5-5 5 15H2L8 3z',
  key: 'otkl63'
}], ['path', {
  d: 'M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19',
  key: '1pvmmp'
}]]);
var MountainSnow$1 = MountainSnow;

var Mountain = createReactComponent('Mountain', [['path', {
  d: 'm8 3 4 8 5-5 5 15H2L8 3z',
  key: 'otkl63'
}]]);
var Mountain$1 = Mountain;

var MousePointer2 = createReactComponent('MousePointer2', [['path', {
  d: 'm4 4 7.07 17 2.51-7.39L21 11.07z',
  key: '1vqm48'
}]]);
var MousePointer2$1 = MousePointer2;

var MousePointerClick = createReactComponent('MousePointerClick', [['path', {
  d: 'm9 9 5 12 1.774-5.226L21 14 9 9z',
  key: '1qd44z'
}], ['path', {
  d: 'm16.071 16.071 4.243 4.243',
  key: 'wfhsjb'
}], ['path', {
  d: 'm7.188 2.239.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656-2.12 2.122',
  key: '1bk8fz'
}]]);
var MousePointerClick$1 = MousePointerClick;

var MousePointer = createReactComponent('MousePointer', [['path', {
  d: 'm3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z',
  key: 'y2ucgo'
}], ['path', {
  d: 'm13 13 6 6',
  key: '1nhxnf'
}]]);
var MousePointer$1 = MousePointer;

var Mouse = createReactComponent('Mouse', [['rect', {
  x: '6',
  y: '3',
  width: '12',
  height: '18',
  rx: '6',
  key: 'wskjtk'
}], ['path', {
  d: 'M12 7v4',
  key: 'xawao1'
}]]);
var Mouse$1 = Mouse;

var Move3d = createReactComponent('Move3d', [['path', {
  d: 'M5 3v16h16',
  key: '1mqmf9'
}], ['path', {
  d: 'm5 19 6-6',
  key: 'jh6hbb'
}], ['path', {
  d: 'm2 6 3-3 3 3',
  key: 'tkyvxa'
}], ['path', {
  d: 'm18 16 3 3-3 3',
  key: '1d4glt'
}]]);
var Move3d$1 = Move3d;

var MoveDiagonal2 = createReactComponent('MoveDiagonal2', [['polyline', {
  points: '5 11 5 5 11 5',
  key: 'ncfzxk'
}], ['polyline', {
  points: '19 13 19 19 13 19',
  key: '1mk7hk'
}], ['line', {
  x1: '5',
  y1: '5',
  x2: '19',
  y2: '19',
  key: '4tvgsr'
}]]);
var MoveDiagonal2$1 = MoveDiagonal2;

var MoveDiagonal = createReactComponent('MoveDiagonal', [['polyline', {
  points: '13 5 19 5 19 11',
  key: '11219e'
}], ['polyline', {
  points: '11 19 5 19 5 13',
  key: 'sfq3wq'
}], ['line', {
  x1: '19',
  y1: '5',
  x2: '5',
  y2: '19',
  key: 't1677v'
}]]);
var MoveDiagonal$1 = MoveDiagonal;

var MoveHorizontal = createReactComponent('MoveHorizontal', [['polyline', {
  points: '18 8 22 12 18 16',
  key: '1hqrds'
}], ['polyline', {
  points: '6 8 2 12 6 16',
  key: 'f0ernq'
}], ['line', {
  x1: '2',
  y1: '12',
  x2: '22',
  y2: '12',
  key: 'zvmn4p'
}]]);
var MoveHorizontal$1 = MoveHorizontal;

var MoveVertical = createReactComponent('MoveVertical', [['polyline', {
  points: '8 18 12 22 16 18',
  key: '1uutw3'
}], ['polyline', {
  points: '8 6 12 2 16 6',
  key: 'd60sxy'
}], ['line', {
  x1: '12',
  y1: '2',
  x2: '12',
  y2: '22',
  key: '1k6o5o'
}]]);
var MoveVertical$1 = MoveVertical;

var Move = createReactComponent('Move', [['polyline', {
  points: '5 9 2 12 5 15',
  key: '1r5uj5'
}], ['polyline', {
  points: '9 5 12 2 15 5',
  key: '5v383o'
}], ['polyline', {
  points: '15 19 12 22 9 19',
  key: 'g7qi8m'
}], ['polyline', {
  points: '19 9 22 12 19 15',
  key: 'tpp73q'
}], ['line', {
  x1: '2',
  y1: '12',
  x2: '22',
  y2: '12',
  key: 'zvmn4p'
}], ['line', {
  x1: '12',
  y1: '2',
  x2: '12',
  y2: '22',
  key: '1k6o5o'
}]]);
var Move$1 = Move;

var Music2 = createReactComponent('Music2', [['circle', {
  cx: '8',
  cy: '18',
  r: '4',
  key: '1fc0mg'
}], ['path', {
  d: 'M12 18V2l7 4',
  key: 'g04rme'
}]]);
var Music2$1 = Music2;

var Music3 = createReactComponent('Music3', [['circle', {
  cx: '12',
  cy: '18',
  r: '4',
  key: 'm3r9ws'
}], ['path', {
  d: 'M16 18V2',
  key: '40x2m5'
}]]);
var Music3$1 = Music3;

var Music4 = createReactComponent('Music4', [['path', {
  d: 'M9 18V5l12-2v13',
  key: '1jmyc2'
}], ['path', {
  d: 'm9 9 12-2',
  key: '1e64n2'
}], ['circle', {
  cx: '6',
  cy: '18',
  r: '3',
  key: 'fqmcym'
}], ['circle', {
  cx: '18',
  cy: '16',
  r: '3',
  key: '1hluhg'
}]]);
var Music4$1 = Music4;

var Music = createReactComponent('Music', [['path', {
  d: 'M9 18V5l12-2v13',
  key: '1jmyc2'
}], ['circle', {
  cx: '6',
  cy: '18',
  r: '3',
  key: 'fqmcym'
}], ['circle', {
  cx: '18',
  cy: '16',
  r: '3',
  key: '1hluhg'
}]]);
var Music$1 = Music;

var Navigation2Off = createReactComponent('Navigation2Off', [['path', {
  d: 'M9.31 9.31 5 21l7-4 7 4-1.17-3.17',
  key: 'qoq2o2'
}], ['path', {
  d: 'M14.53 8.88 12 2l-1.17 3.17',
  key: 'k3sjzy'
}], ['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}]]);
var Navigation2Off$1 = Navigation2Off;

var Navigation2 = createReactComponent('Navigation2', [['polygon', {
  points: '12 2 19 21 12 17 5 21 12 2',
  key: 'x8c0qg'
}]]);
var Navigation2$1 = Navigation2;

var NavigationOff = createReactComponent('NavigationOff', [['path', {
  d: 'M8.43 8.43 3 11l8 2 2 8 2.57-5.43',
  key: '1vdtb7'
}], ['path', {
  d: 'M17.39 11.73 22 2l-9.73 4.61',
  key: 'tya3r6'
}], ['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}]]);
var NavigationOff$1 = NavigationOff;

var Navigation = createReactComponent('Navigation', [['polygon', {
  points: '3 11 22 2 13 21 11 13 3 11',
  key: '1ltx0t'
}]]);
var Navigation$1 = Navigation;

var Network = createReactComponent('Network', [['rect', {
  x: '9',
  y: '2',
  width: '6',
  height: '6',
  key: '1iwon9'
}], ['rect', {
  x: '16',
  y: '16',
  width: '6',
  height: '6',
  key: 'gonbwd'
}], ['rect', {
  x: '2',
  y: '16',
  width: '6',
  height: '6',
  key: '1q0lzr'
}], ['path', {
  d: 'M5 16v-4h14v4',
  key: '8njgxx'
}], ['path', {
  d: 'M12 12V8',
  key: '2874zd'
}]]);
var Network$1 = Network;

var Newspaper = createReactComponent('Newspaper', [['path', {
  d: 'M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2',
  key: '7pis2x'
}], ['path', {
  d: 'M18 14h-8',
  key: 'sponae'
}], ['path', {
  d: 'M15 18h-5',
  key: '95g1m2'
}], ['path', {
  d: 'M10 6h8v4h-8V6Z',
  key: 'smlsk5'
}]]);
var Newspaper$1 = Newspaper;

var Octagon = createReactComponent('Octagon', [['polygon', {
  points: '7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2',
  key: 'h1p8hx'
}]]);
var Octagon$1 = Octagon;

var Option = createReactComponent('Option', [['path', {
  d: 'M3 3h6l6 18h6',
  key: 'ph9rgk'
}], ['path', {
  d: 'M14 3h7',
  key: '16f0ms'
}]]);
var Option$1 = Option;

var Outdent = createReactComponent('Outdent', [['polyline', {
  points: '7 8 3 12 7 16',
  key: '2j60jr'
}], ['line', {
  x1: '21',
  y1: '12',
  x2: '11',
  y2: '12',
  key: '1xy73i'
}], ['line', {
  x1: '21',
  y1: '6',
  x2: '11',
  y2: '6',
  key: '97xvqg'
}], ['line', {
  x1: '21',
  y1: '18',
  x2: '11',
  y2: '18',
  key: '1r7j8g'
}]]);
var Outdent$1 = Outdent;

var Package2 = createReactComponent('Package2', [['path', {
  d: 'M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z',
  key: '1ront0'
}], ['path', {
  d: 'm3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9',
  key: '19h2x1'
}], ['path', {
  d: 'M12 3v6',
  key: '1holv5'
}]]);
var Package2$1 = Package2;

var PackageCheck = createReactComponent('PackageCheck', [['path', {
  d: 'm16 16 2 2 4-4',
  key: 'gfu2re'
}], ['path', {
  d: 'M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14',
  key: 'e7tb2h'
}], ['path', {
  d: 'M16.5 9.4 7.55 4.24',
  key: '10qotr'
}], ['polyline', {
  points: '3.29 7 12 12 20.71 7',
  key: 'ousv84'
}], ['line', {
  x1: '12',
  y1: '22',
  x2: '12',
  y2: '12',
  key: 'gdv6h4'
}]]);
var PackageCheck$1 = PackageCheck;

var PackageMinus = createReactComponent('PackageMinus', [['path', {
  d: 'M16 16h6',
  key: '100bgy'
}], ['path', {
  d: 'M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14',
  key: 'e7tb2h'
}], ['path', {
  d: 'M16.5 9.4 7.55 4.24',
  key: '10qotr'
}], ['polyline', {
  points: '3.29 7 12 12 20.71 7',
  key: 'ousv84'
}], ['line', {
  x1: '12',
  y1: '22',
  x2: '12',
  y2: '12',
  key: 'gdv6h4'
}]]);
var PackageMinus$1 = PackageMinus;

var PackageOpen = createReactComponent('PackageOpen', [['path', {
  d: 'M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z',
  key: '1vy178'
}], ['path', {
  d: 'm3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z',
  key: 's3bv25'
}], ['line', {
  x1: '12',
  y1: '22',
  x2: '12',
  y2: '13',
  key: '15r0fr'
}], ['path', {
  d: 'M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5',
  key: '1na2nq'
}]]);
var PackageOpen$1 = PackageOpen;

var PackagePlus = createReactComponent('PackagePlus', [['path', {
  d: 'M16 16h6',
  key: '100bgy'
}], ['path', {
  d: 'M19 13v6',
  key: '85cyf1'
}], ['path', {
  d: 'M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14',
  key: 'e7tb2h'
}], ['path', {
  d: 'M16.5 9.4 7.55 4.24',
  key: '10qotr'
}], ['polyline', {
  points: '3.29 7 12 12 20.71 7',
  key: 'ousv84'
}], ['line', {
  x1: '12',
  y1: '22',
  x2: '12',
  y2: '12',
  key: 'gdv6h4'
}]]);
var PackagePlus$1 = PackagePlus;

var PackageSearch = createReactComponent('PackageSearch', [['path', {
  d: 'M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14',
  key: 'e7tb2h'
}], ['path', {
  d: 'M16.5 9.4 7.55 4.24',
  key: '10qotr'
}], ['polyline', {
  points: '3.29 7 12 12 20.71 7',
  key: 'ousv84'
}], ['line', {
  x1: '12',
  y1: '22',
  x2: '12',
  y2: '12',
  key: 'gdv6h4'
}], ['circle', {
  cx: '18.5',
  cy: '15.5',
  r: '2.5',
  key: 'b5zd12'
}], ['path', {
  d: 'M20.27 17.27 22 19',
  key: '1l4muz'
}]]);
var PackageSearch$1 = PackageSearch;

var PackageX = createReactComponent('PackageX', [['path', {
  d: 'M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14',
  key: 'e7tb2h'
}], ['path', {
  d: 'M16.5 9.4 7.55 4.24',
  key: '10qotr'
}], ['polyline', {
  points: '3.29 7 12 12 20.71 7',
  key: 'ousv84'
}], ['line', {
  x1: '12',
  y1: '22',
  x2: '12',
  y2: '12',
  key: 'gdv6h4'
}], ['path', {
  d: 'm17 13 5 5m-5 0 5-5',
  key: 'im3w4b'
}]]);
var PackageX$1 = PackageX;

var Package = createReactComponent('Package', [['line', {
  x1: '16.5',
  y1: '9.4',
  x2: '7.5',
  y2: '4.21',
  key: 'i6f8yp'
}], ['path', {
  d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  key: 'yt0hxn'
}], ['polyline', {
  points: '3.29 7 12 12 20.71 7',
  key: 'ousv84'
}], ['line', {
  x1: '12',
  y1: '22',
  x2: '12',
  y2: '12',
  key: 'gdv6h4'
}]]);
var Package$1 = Package;

var PaintBucket = createReactComponent('PaintBucket', [['path', {
  d: 'm19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z',
  key: 'irua1i'
}], ['path', {
  d: 'm5 2 5 5',
  key: '1lls2c'
}], ['path', {
  d: 'M2 13h15',
  key: '1hkzvu'
}], ['path', {
  d: 'M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z',
  key: 'xk76lq'
}]]);
var PaintBucket$1 = PaintBucket;

var Paintbrush2 = createReactComponent('Paintbrush2', [['path', {
  d: 'M14 19.9V16h3a2 2 0 0 0 2-2v-2H5v2c0 1.1.9 2 2 2h3v3.9a2 2 0 1 0 4 0Z',
  key: '1c8kta'
}], ['path', {
  d: 'M6 12V2h12v10',
  key: '1esbnf'
}], ['path', {
  d: 'M14 2v4',
  key: 'qmzblu'
}], ['path', {
  d: 'M10 2v2',
  key: '7u0qdc'
}]]);
var Paintbrush2$1 = Paintbrush2;

var Paintbrush = createReactComponent('Paintbrush', [['path', {
  d: 'M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z',
  key: 'm6k5sh'
}], ['path', {
  d: 'M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7',
  key: 'arzq70'
}], ['path', {
  d: 'M14.5 17.5 4.5 15',
  key: 's7fvrz'
}]]);
var Paintbrush$1 = Paintbrush;

var Palette = createReactComponent('Palette', [['circle', {
  cx: '13.5',
  cy: '6.5',
  r: '.5',
  key: '1xcu5'
}], ['circle', {
  cx: '17.5',
  cy: '10.5',
  r: '.5',
  key: '736e4u'
}], ['circle', {
  cx: '8.5',
  cy: '7.5',
  r: '.5',
  key: 'clrty'
}], ['circle', {
  cx: '6.5',
  cy: '12.5',
  r: '.5',
  key: '1s4xz9'
}], ['path', {
  d: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z',
  key: '12rzf8'
}]]);
var Palette$1 = Palette;

var Palmtree = createReactComponent('Palmtree', [['path', {
  d: 'M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4',
  key: 'foxbe7'
}], ['path', {
  d: 'M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3',
  key: '18arnh'
}], ['path', {
  d: 'M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35z',
  key: 'epoumf'
}], ['path', {
  d: 'M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14',
  key: 'ft0feo'
}]]);
var Palmtree$1 = Palmtree;

var Paperclip = createReactComponent('Paperclip', [['path', {
  d: 'm21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48',
  key: '1u3ebp'
}]]);
var Paperclip$1 = Paperclip;

var PartyPopper = createReactComponent('PartyPopper', [['path', {
  d: 'M5.8 11.3 2 22l10.7-3.79',
  key: 'gwxi1d'
}], ['path', {
  d: 'M4 3h.01',
  key: '1vcuye'
}], ['path', {
  d: 'M22 8h.01',
  key: '1mrtc2'
}], ['path', {
  d: 'M15 2h.01',
  key: '1cjtqr'
}], ['path', {
  d: 'M22 20h.01',
  key: '1mrys2'
}], ['path', {
  d: 'm22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10',
  key: 'bpx1uq'
}], ['path', {
  d: 'm22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17',
  key: '1pd0s7'
}], ['path', {
  d: 'm11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7',
  key: 'zq5xbz'
}], ['path', {
  d: 'M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z',
  key: '4kbmks'
}]]);
var PartyPopper$1 = PartyPopper;

var PauseCircle = createReactComponent('PauseCircle', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['line', {
  x1: '10',
  y1: '15',
  x2: '10',
  y2: '9',
  key: '2cxng6'
}], ['line', {
  x1: '14',
  y1: '15',
  x2: '14',
  y2: '9',
  key: 'wsglx2'
}]]);
var PauseCircle$1 = PauseCircle;

var PauseOctagon = createReactComponent('PauseOctagon', [['path', {
  d: 'M10 15V9',
  key: '1lckn7'
}], ['path', {
  d: 'M14 15V9',
  key: '1muqhk'
}], ['path', {
  d: 'M7.714 2h8.572L22 7.714v8.572L16.286 22H7.714L2 16.286V7.714L7.714 2z',
  key: '1m7qra'
}]]);
var PauseOctagon$1 = PauseOctagon;

var Pause = createReactComponent('Pause', [['rect', {
  x: '6',
  y: '4',
  width: '4',
  height: '16',
  key: '5yltu4'
}], ['rect', {
  x: '14',
  y: '4',
  width: '4',
  height: '16',
  key: 'duxydb'
}]]);
var Pause$1 = Pause;

var PenTool = createReactComponent('PenTool', [['path', {
  d: 'm12 19 7-7 3 3-7 7-3-3z',
  key: 'rklqx2'
}], ['path', {
  d: 'm18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z',
  key: '1et58u'
}], ['path', {
  d: 'm2 2 7.586 7.586',
  key: 'etlp93'
}], ['circle', {
  cx: '11',
  cy: '11',
  r: '2',
  key: 'xmgehs'
}]]);
var PenTool$1 = PenTool;

var Pencil = createReactComponent('Pencil', [['line', {
  x1: '18',
  y1: '2',
  x2: '22',
  y2: '6',
  key: '1k5sg2'
}], ['path', {
  d: 'M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z',
  key: '12iwkt'
}]]);
var Pencil$1 = Pencil;

var Percent = createReactComponent('Percent', [['line', {
  x1: '19',
  y1: '5',
  x2: '5',
  y2: '19',
  key: 't1677v'
}], ['circle', {
  cx: '6.5',
  cy: '6.5',
  r: '2.5',
  key: '4mh3h7'
}], ['circle', {
  cx: '17.5',
  cy: '17.5',
  r: '2.5',
  key: '1mdrzq'
}]]);
var Percent$1 = Percent;

var PersonStanding = createReactComponent('PersonStanding', [['circle', {
  cx: '12',
  cy: '5',
  r: '1',
  key: 'gxeob9'
}], ['path', {
  d: 'm9 20 3-6 3 6',
  key: 'se2kox'
}], ['path', {
  d: 'm6 8 6 2 6-2',
  key: '4o3us4'
}], ['path', {
  d: 'M12 10v4',
  key: '1kjpxc'
}]]);
var PersonStanding$1 = PersonStanding;

var PhoneCall = createReactComponent('PhoneCall', [['path', {
  d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  key: 'foiqr5'
}], ['path', {
  d: 'M14.05 2a9 9 0 0 1 8 7.94',
  key: 'vmijpz'
}], ['path', {
  d: 'M14.05 6A5 5 0 0 1 18 10',
  key: '13nbpp'
}]]);
var PhoneCall$1 = PhoneCall;

var PhoneForwarded = createReactComponent('PhoneForwarded', [['polyline', {
  points: '18 2 22 6 18 10',
  key: '6vjanh'
}], ['line', {
  x1: '14',
  y1: '6',
  x2: '22',
  y2: '6',
  key: '1yuov7'
}], ['path', {
  d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  key: 'foiqr5'
}]]);
var PhoneForwarded$1 = PhoneForwarded;

var PhoneIncoming = createReactComponent('PhoneIncoming', [['polyline', {
  points: '16 2 16 8 22 8',
  key: '1ygljm'
}], ['line', {
  x1: '22',
  y1: '2',
  x2: '16',
  y2: '8',
  key: 'kb9lty'
}], ['path', {
  d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  key: 'foiqr5'
}]]);
var PhoneIncoming$1 = PhoneIncoming;

var PhoneMissed = createReactComponent('PhoneMissed', [['line', {
  x1: '22',
  y1: '2',
  x2: '16',
  y2: '8',
  key: 'kb9lty'
}], ['line', {
  x1: '16',
  y1: '2',
  x2: '22',
  y2: '8',
  key: '11291p'
}], ['path', {
  d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  key: 'foiqr5'
}]]);
var PhoneMissed$1 = PhoneMissed;

var PhoneOff = createReactComponent('PhoneOff', [['path', {
  d: 'M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91',
  key: 'z86iuo'
}], ['line', {
  x1: '22',
  y1: '2',
  x2: '2',
  y2: '22',
  key: '1sphze'
}]]);
var PhoneOff$1 = PhoneOff;

var PhoneOutgoing = createReactComponent('PhoneOutgoing', [['polyline', {
  points: '22 8 22 2 16 2',
  key: '1g204g'
}], ['line', {
  x1: '16',
  y1: '8',
  x2: '22',
  y2: '2',
  key: '1hkegm'
}], ['path', {
  d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  key: 'foiqr5'
}]]);
var PhoneOutgoing$1 = PhoneOutgoing;

var Phone = createReactComponent('Phone', [['path', {
  d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  key: 'foiqr5'
}]]);
var Phone$1 = Phone;

var PieChart = createReactComponent('PieChart', [['path', {
  d: 'M21.21 15.89A10 10 0 1 1 8 2.83',
  key: 'k2fpak'
}], ['path', {
  d: 'M22 12A10 10 0 0 0 12 2v10z',
  key: '1rfc4y'
}]]);
var PieChart$1 = PieChart;

var PiggyBank = createReactComponent('PiggyBank', [['path', {
  d: 'M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z',
  key: 'uf6l00'
}], ['path', {
  d: 'M2 9v1c0 1.1.9 2 2 2h1',
  key: 'nm575m'
}], ['path', {
  d: 'M16 11h0',
  key: 'k2aug8'
}]]);
var PiggyBank$1 = PiggyBank;

var PinOff = createReactComponent('PinOff', [['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}], ['line', {
  x1: '12',
  y1: '17',
  x2: '12',
  y2: '22',
  key: 'fb3qrx'
}], ['path', {
  d: 'M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h12',
  key: '13x2n8'
}], ['path', {
  d: 'M15 9.34V6h1a2 2 0 0 0 0-4H7.89',
  key: 'reo3ki'
}]]);
var PinOff$1 = PinOff;

var Pin = createReactComponent('Pin', [['line', {
  x1: '12',
  y1: '17',
  x2: '12',
  y2: '22',
  key: 'fb3qrx'
}], ['path', {
  d: 'M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z',
  key: '13yl11'
}]]);
var Pin$1 = Pin;

var Pipette = createReactComponent('Pipette', [['path', {
  d: 'm2 22 1-1h3l9-9',
  key: '1sre89'
}], ['path', {
  d: 'M3 21v-3l9-9',
  key: 'hpe2y6'
}], ['path', {
  d: 'm15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z',
  key: '196du1'
}]]);
var Pipette$1 = Pipette;

var Pizza = createReactComponent('Pizza', [['path', {
  d: 'M15 11h.01',
  key: 'rns66s'
}], ['path', {
  d: 'M11 15h.01',
  key: 'k85uqc'
}], ['path', {
  d: 'M16 16h.01',
  key: '1f9h7w'
}], ['path', {
  d: 'm2 16 20 6-6-20c-3.36.9-6.42 2.67-8.88 5.12A19.876 19.876 0 0 0 2 16Z',
  key: '1akyvp'
}], ['path', {
  d: 'M17 6c-6.29 1.47-9.43 5.13-11 11',
  key: '1dsok0'
}]]);
var Pizza$1 = Pizza;

var Plane = createReactComponent('Plane', [['path', {
  d: 'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z',
  key: '1v9wt8'
}]]);
var Plane$1 = Plane;

var PlayCircle = createReactComponent('PlayCircle', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['polygon', {
  points: '10 8 16 12 10 16 10 8',
  key: '1cimsy'
}]]);
var PlayCircle$1 = PlayCircle;

var Play = createReactComponent('Play', [['polygon', {
  points: '5 3 19 12 5 21 5 3',
  key: '191637'
}]]);
var Play$1 = Play;

var Plug2 = createReactComponent('Plug2', [['path', {
  d: 'M9 2v6',
  key: '17ngun'
}], ['path', {
  d: 'M15 2v6',
  key: 's7yy2p'
}], ['path', {
  d: 'M12 17v5',
  key: 'bb1du9'
}], ['path', {
  d: 'M5 8h14',
  key: 'pcz4l3'
}], ['path', {
  d: 'M6 11V8h12v3a6 6 0 1 1-12 0v0Z',
  key: 'nd4hoy'
}]]);
var Plug2$1 = Plug2;

var PlugZap = createReactComponent('PlugZap', [['path', {
  d: 'm13 2-2 2.5h3L12 7',
  key: '1me98u'
}], ['path', {
  d: 'M12 22v-3',
  key: 'kmzjlo'
}], ['path', {
  d: 'M10 13v-2.5',
  key: '1g2mrq'
}], ['path', {
  d: 'M10 12.5v-2',
  key: 'pcvzbb'
}], ['path', {
  d: 'M14 12.5v-2',
  key: 'qv1toj'
}], ['path', {
  d: 'M16 15a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2z',
  key: '17xmdd'
}]]);
var PlugZap$1 = PlugZap;

var Plug = createReactComponent('Plug', [['path', {
  d: 'M12 22v-5',
  key: '1ega77'
}], ['path', {
  d: 'M9 7V2',
  key: '1r97uf'
}], ['path', {
  d: 'M15 7V2',
  key: '1uo4jc'
}], ['path', {
  d: 'M6 13V8h12v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4Z',
  key: '1xki7n'
}]]);
var Plug$1 = Plug;

var PlusCircle = createReactComponent('PlusCircle', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['line', {
  x1: '12',
  y1: '8',
  x2: '12',
  y2: '16',
  key: '55jlg'
}], ['line', {
  x1: '8',
  y1: '12',
  x2: '16',
  y2: '12',
  key: '1myapg'
}]]);
var PlusCircle$1 = PlusCircle;

var PlusSquare = createReactComponent('PlusSquare', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['line', {
  x1: '12',
  y1: '8',
  x2: '12',
  y2: '16',
  key: '55jlg'
}], ['line', {
  x1: '8',
  y1: '12',
  x2: '16',
  y2: '12',
  key: '1myapg'
}]]);
var PlusSquare$1 = PlusSquare;

var Plus = createReactComponent('Plus', [['line', {
  x1: '12',
  y1: '5',
  x2: '12',
  y2: '19',
  key: 'myz83a'
}], ['line', {
  x1: '5',
  y1: '12',
  x2: '19',
  y2: '12',
  key: '1smlys'
}]]);
var Plus$1 = Plus;

var Pocket = createReactComponent('Pocket', [['path', {
  d: 'M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z',
  key: '1mz881'
}], ['polyline', {
  points: '8 10 12 14 16 10',
  key: 'w4mbv5'
}]]);
var Pocket$1 = Pocket;

var Podcast = createReactComponent('Podcast', [['circle', {
  cx: '12',
  cy: '11',
  r: '1',
  key: '1gvufo'
}], ['path', {
  d: 'M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5Z',
  key: '1n5fvv'
}], ['path', {
  d: 'M8 14a5 5 0 1 1 8 0',
  key: 'fc81rn'
}], ['path', {
  d: 'M17 18.5a9 9 0 1 0-10 0',
  key: 'jqtxkf'
}]]);
var Podcast$1 = Podcast;

var Pointer = createReactComponent('Pointer', [['path', {
  d: 'M22 14a8 8 0 0 1-8 8',
  key: '56vcr3'
}], ['path', {
  d: 'M18 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0',
  key: '1pp0yd'
}], ['path', {
  d: 'M14 10V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1',
  key: 'u654g'
}], ['path', {
  d: 'M10 9.5V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10',
  key: '1e2dtv'
}], ['path', {
  d: 'M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15',
  key: 'g6ys72'
}]]);
var Pointer$1 = Pointer;

var PoundSterling = createReactComponent('PoundSterling', [['path', {
  d: 'M18 7c0-5.333-8-5.333-8 0',
  key: '1prm2n'
}], ['path', {
  d: 'M10 7v14',
  key: '18tmcs'
}], ['path', {
  d: 'M6 21h12',
  key: '4dkmi1'
}], ['path', {
  d: 'M6 13h10',
  key: 'ybwr4a'
}]]);
var PoundSterling$1 = PoundSterling;

var PowerOff = createReactComponent('PowerOff', [['path', {
  d: 'M18.36 6.64A9 9 0 0 1 20.77 15',
  key: 'dxknvb'
}], ['path', {
  d: 'M6.16 6.16a9 9 0 1 0 12.68 12.68',
  key: '1x7qb5'
}], ['path', {
  d: 'M12 2v4',
  key: '3427ic'
}], ['path', {
  d: 'm2 2 20 20',
  key: '1ooewy'
}]]);
var PowerOff$1 = PowerOff;

var Power = createReactComponent('Power', [['path', {
  d: 'M18.36 6.64a9 9 0 1 1-12.73 0',
  key: 'phirl6'
}], ['line', {
  x1: '12',
  y1: '2',
  x2: '12',
  y2: '12',
  key: '1d1p48'
}]]);
var Power$1 = Power;

var Printer = createReactComponent('Printer', [['polyline', {
  points: '6 9 6 2 18 2 18 9',
  key: '1306q4'
}], ['path', {
  d: 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2',
  key: '143wyd'
}], ['rect', {
  x: '6',
  y: '14',
  width: '12',
  height: '8',
  key: 'emw7yt'
}]]);
var Printer$1 = Printer;

var Puzzle = createReactComponent('Puzzle', [['path', {
  d: 'M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z',
  key: 'i0oyt7'
}]]);
var Puzzle$1 = Puzzle;

var QrCode = createReactComponent('QrCode', [['rect', {
  x: '3',
  y: '3',
  width: '5',
  height: '5',
  rx: '1',
  key: 'fue5ao'
}], ['rect', {
  x: '16',
  y: '3',
  width: '5',
  height: '5',
  rx: '1',
  key: '1narh3'
}], ['rect', {
  x: '3',
  y: '16',
  width: '5',
  height: '5',
  rx: '1',
  key: '1ovwlo'
}], ['path', {
  d: 'M21 16h-3a2 2 0 0 0-2 2v3',
  key: '177gqh'
}], ['path', {
  d: 'M21 21v.01',
  key: 'ents32'
}], ['path', {
  d: 'M12 7v3a2 2 0 0 1-2 2H7',
  key: '8crl2c'
}], ['path', {
  d: 'M3 12h.01',
  key: 'nlz23k'
}], ['path', {
  d: 'M12 3h.01',
  key: 'n36tog'
}], ['path', {
  d: 'M12 16v.01',
  key: '133mhm'
}], ['path', {
  d: 'M16 12h1',
  key: '1slzba'
}], ['path', {
  d: 'M21 12v.01',
  key: '1lwtk9'
}], ['path', {
  d: 'M12 21v-1',
  key: '1880an'
}]]);
var QrCode$1 = QrCode;

var Quote = createReactComponent('Quote', [['path', {
  d: 'M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z',
  key: '4rm80e'
}], ['path', {
  d: 'M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z',
  key: '10za9r'
}]]);
var Quote$1 = Quote;

var RadioReceiver = createReactComponent('RadioReceiver', [['path', {
  d: 'M5 16v2',
  key: 'g5qcv5'
}], ['path', {
  d: 'M19 16v2',
  key: '1gbaio'
}], ['rect', {
  x: '2',
  y: '8',
  width: '20',
  height: '8',
  rx: '2',
  key: '1xflse'
}], ['path', {
  d: 'M18 12h0',
  key: '1ucjzd'
}]]);
var RadioReceiver$1 = RadioReceiver;

var Radio = createReactComponent('Radio', [['circle', {
  cx: '12',
  cy: '12',
  r: '2',
  key: '1c9p78'
}], ['path', {
  d: 'M4.93 19.07a10 10 0 0 1 0-14.14',
  key: 'r41b39'
}], ['path', {
  d: 'M7.76 16.24a6 6 0 0 1-1.3-1.95 6 6 0 0 1 0-4.59 6 6 0 0 1 1.3-1.95',
  key: '1pc8et'
}], ['path', {
  d: 'M16.24 7.76a6 6 0 0 1 1.3 2 6 6 0 0 1 0 4.59 6 6 0 0 1-1.3 1.95',
  key: '8dzjga'
}], ['path', {
  d: 'M19.07 4.93a10 10 0 0 1 0 14.14',
  key: '1kegas'
}]]);
var Radio$1 = Radio;

var RectangleHorizontal = createReactComponent('RectangleHorizontal', [['rect', {
  x: '2',
  y: '6',
  width: '20',
  height: '12',
  rx: '2',
  key: '1wpnh2'
}]]);
var RectangleHorizontal$1 = RectangleHorizontal;

var RectangleVertical = createReactComponent('RectangleVertical', [['rect', {
  x: '6',
  y: '2',
  width: '12',
  height: '20',
  rx: '2',
  key: '749fme'
}]]);
var RectangleVertical$1 = RectangleVertical;

var Recycle = createReactComponent('Recycle', [['path', {
  d: 'M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5',
  key: 'x6z5xu'
}], ['path', {
  d: 'M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12',
  key: '1x4zh5'
}], ['path', {
  d: 'm14 16-3 3 3 3',
  key: 'f6jyew'
}], ['path', {
  d: 'M8.293 13.596 7.196 9.5 3.1 10.598',
  key: 'wf1obh'
}], ['path', {
  d: 'm9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843',
  key: '9tzpgr'
}], ['path', {
  d: 'm13.378 9.633 4.096 1.098 1.097-4.096',
  key: '1oe83g'
}]]);
var Recycle$1 = Recycle;

var Redo2 = createReactComponent('Redo2', [['path', {
  d: 'm15 14 5-5-5-5',
  key: '12vg1m'
}], ['path', {
  d: 'M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13',
  key: '19mnr4'
}]]);
var Redo2$1 = Redo2;

var Redo = createReactComponent('Redo', [['path', {
  d: 'M21 7v6h-6',
  key: '3ptur4'
}], ['path', {
  d: 'M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7',
  key: '1kgawr'
}]]);
var Redo$1 = Redo;

var RefreshCcw = createReactComponent('RefreshCcw', [['path', {
  d: 'M3 2v6h6',
  key: '18ldww'
}], ['path', {
  d: 'M21 12A9 9 0 0 0 6 5.3L3 8',
  key: '1pbrqz'
}], ['path', {
  d: 'M21 22v-6h-6',
  key: 'usdfbe'
}], ['path', {
  d: 'M3 12a9 9 0 0 0 15 6.7l3-2.7',
  key: '1hosoe'
}]]);
var RefreshCcw$1 = RefreshCcw;

var RefreshCw = createReactComponent('RefreshCw', [['path', {
  d: 'M21 2v6h-6',
  key: '1lwg0q'
}], ['path', {
  d: 'M3 12a9 9 0 0 1 15-6.7L21 8',
  key: 'vaktt2'
}], ['path', {
  d: 'M3 22v-6h6',
  key: '6llvyv'
}], ['path', {
  d: 'M21 12a9 9 0 0 1-15 6.7L3 16',
  key: 'i52hsp'
}]]);
var RefreshCw$1 = RefreshCw;

var Refrigerator = createReactComponent('Refrigerator', [['path', {
  d: 'M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z',
  key: 'fpq118'
}], ['path', {
  d: 'M5 10h14',
  key: 'elsbfy'
}], ['path', {
  d: 'M15 7v6',
  key: '1nx30x'
}]]);
var Refrigerator$1 = Refrigerator;

var Regex = createReactComponent('Regex', [['path', {
  d: 'M17 3v10',
  key: '15fgeh'
}], ['path', {
  d: 'm12.67 5.5 8.66 5',
  key: '1gpheq'
}], ['path', {
  d: 'm12.67 10.5 8.66-5',
  key: '1dkfa6'
}], ['path', {
  d: 'M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2z',
  key: 'swwfx4'
}]]);
var Regex$1 = Regex;

var Repeat1 = createReactComponent('Repeat1', [['path', {
  d: 'm17 2 4 4-4 4',
  key: 'nntrym'
}], ['path', {
  d: 'M3 11v-1a4 4 0 0 1 4-4h14',
  key: '84bu3i'
}], ['path', {
  d: 'm7 22-4-4 4-4',
  key: '1wqhfi'
}], ['path', {
  d: 'M21 13v1a4 4 0 0 1-4 4H3',
  key: '1rx37r'
}], ['path', {
  d: 'M11 10h1v4',
  key: '70cz1p'
}]]);
var Repeat1$1 = Repeat1;

var Repeat = createReactComponent('Repeat', [['path', {
  d: 'm17 2 4 4-4 4',
  key: 'nntrym'
}], ['path', {
  d: 'M3 11v-1a4 4 0 0 1 4-4h14',
  key: '84bu3i'
}], ['path', {
  d: 'm7 22-4-4 4-4',
  key: '1wqhfi'
}], ['path', {
  d: 'M21 13v1a4 4 0 0 1-4 4H3',
  key: '1rx37r'
}]]);
var Repeat$1 = Repeat;

var ReplyAll = createReactComponent('ReplyAll', [['polyline', {
  points: '7 17 2 12 7 7',
  key: 't83bqg'
}], ['polyline', {
  points: '12 17 7 12 12 7',
  key: '1g4ajm'
}], ['path', {
  d: 'M22 18v-2a4 4 0 0 0-4-4H7',
  key: '1fcyog'
}]]);
var ReplyAll$1 = ReplyAll;

var Reply = createReactComponent('Reply', [['polyline', {
  points: '9 17 4 12 9 7',
  key: 'hvgpf2'
}], ['path', {
  d: 'M20 18v-2a4 4 0 0 0-4-4H4',
  key: '5vmcpk'
}]]);
var Reply$1 = Reply;

var Rewind = createReactComponent('Rewind', [['polygon', {
  points: '11 19 2 12 11 5 11 19',
  key: '14yba5'
}], ['polygon', {
  points: '22 19 13 12 22 5 22 19',
  key: '1pi1cj'
}]]);
var Rewind$1 = Rewind;

var Rocket = createReactComponent('Rocket', [['path', {
  d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
  key: 'm3kijz'
}], ['path', {
  d: 'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z',
  key: '1fmvmk'
}], ['path', {
  d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0',
  key: '1f8sc4'
}], ['path', {
  d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
  key: 'qeys4'
}]]);
var Rocket$1 = Rocket;

var RockingChair = createReactComponent('RockingChair', [['polyline', {
  points: '3.5 2 6.5 12.5 18 12.5',
  key: 'y3iy52'
}], ['line', {
  x1: '9.5',
  y1: '12.5',
  x2: '5.5',
  y2: '20',
  key: 'ivgihp'
}], ['line', {
  x1: '15',
  y1: '12.5',
  x2: '18.5',
  y2: '20',
  key: '1palb4'
}], ['path', {
  d: 'M2.75 18a13 13 0 0 0 18.5 0',
  key: '1nquas'
}]]);
var RockingChair$1 = RockingChair;

var Rotate3d = createReactComponent('Rotate3d', [['path', {
  d: 'M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2',
  key: '10n0gc'
}], ['path', {
  d: 'm15.194 13.707 3.814 1.86-1.86 3.814',
  key: '16shm9'
}], ['path', {
  d: 'M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4',
  key: '1lxi77'
}]]);
var Rotate3d$1 = Rotate3d;

var RotateCcw = createReactComponent('RotateCcw', [['path', {
  d: 'M3 2v6h6',
  key: '18ldww'
}], ['path', {
  d: 'M3 13a9 9 0 1 0 3-7.7L3 8',
  key: 'aahkch'
}]]);
var RotateCcw$1 = RotateCcw;

var RotateCw = createReactComponent('RotateCw', [['path', {
  d: 'M21 2v6h-6',
  key: '1lwg0q'
}], ['path', {
  d: 'M21 13a9 9 0 1 1-3-7.7L21 8',
  key: 'vix499'
}]]);
var RotateCw$1 = RotateCw;

var Rss = createReactComponent('Rss', [['path', {
  d: 'M4 11a9 9 0 0 1 9 9',
  key: 'pv89mb'
}], ['path', {
  d: 'M4 4a16 16 0 0 1 16 16',
  key: 'k0647b'
}], ['circle', {
  cx: '5',
  cy: '19',
  r: '1',
  key: 'bfqh0e'
}]]);
var Rss$1 = Rss;

var Ruler = createReactComponent('Ruler', [['path', {
  d: 'M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z',
  key: '14xb44'
}], ['path', {
  d: 'm7.5 10.5 2 2',
  key: '3h1c69'
}], ['path', {
  d: 'm10.5 7.5 2 2',
  key: '1lvsmz'
}], ['path', {
  d: 'm13.5 4.5 2 2',
  key: '1i616n'
}], ['path', {
  d: 'm4.5 13.5 2 2',
  key: '16iojn'
}]]);
var Ruler$1 = Ruler;

var RussianRuble = createReactComponent('RussianRuble', [['path', {
  d: 'M14 11c5.333 0 5.333-8 0-8',
  key: '92e629'
}], ['path', {
  d: 'M6 11h8',
  key: '1cr2u4'
}], ['path', {
  d: 'M6 15h8',
  key: '1y8f6l'
}], ['path', {
  d: 'M9 21V3',
  key: '1jd2g6'
}], ['path', {
  d: 'M9 3h5',
  key: '8bgvcw'
}]]);
var RussianRuble$1 = RussianRuble;

var Sailboat = createReactComponent('Sailboat', [['path', {
  d: 'M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z',
  key: '1404fh'
}], ['path', {
  d: 'M21 14 10 2 3 14h18Z',
  key: '1nzg7v'
}], ['path', {
  d: 'M10 2v16',
  key: '1labyt'
}]]);
var Sailboat$1 = Sailboat;

var Save = createReactComponent('Save', [['path', {
  d: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z',
  key: '1owoqh'
}], ['polyline', {
  points: '17 21 17 13 7 13 7 21',
  key: '1md35c'
}], ['polyline', {
  points: '7 3 7 8 15 8',
  key: '8nz8an'
}]]);
var Save$1 = Save;

var Scale3d = createReactComponent('Scale3d', [['path', {
  d: 'M5 7v12h12',
  key: 'vtaa4r'
}], ['path', {
  d: 'm5 19 6-6',
  key: 'jh6hbb'
}], ['rect', {
  x: '3',
  y: '3',
  width: '4',
  height: '4',
  rx: '1',
  key: '1qeirs'
}], ['rect', {
  x: '17',
  y: '17',
  width: '4',
  height: '4',
  rx: '1',
  key: 'b22pg0'
}]]);
var Scale3d$1 = Scale3d;

var Scale = createReactComponent('Scale', [['path', {
  d: 'm16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z',
  key: '7g6ntu'
}], ['path', {
  d: 'm2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z',
  key: 'ijws7r'
}], ['path', {
  d: 'M7 21h10',
  key: '1b0cd5'
}], ['path', {
  d: 'M12 3v18',
  key: '108xh3'
}], ['path', {
  d: 'M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2',
  key: '3gwbw2'
}]]);
var Scale$1 = Scale;

var Scaling = createReactComponent('Scaling', [['path', {
  d: 'M21 3 9 15',
  key: '15kdhq'
}], ['path', {
  d: 'M12 3H3v18h18v-9',
  key: '8suug0'
}], ['path', {
  d: 'M16 3h5v5',
  key: '1806ms'
}], ['path', {
  d: 'M14 15H9v-5',
  key: 'pi4jk9'
}]]);
var Scaling$1 = Scaling;

var ScanFace = createReactComponent('ScanFace', [['path', {
  d: 'M3 7V5a2 2 0 0 1 2-2h2',
  key: 'aa7l1z'
}], ['path', {
  d: 'M17 3h2a2 2 0 0 1 2 2v2',
  key: '4qcy5o'
}], ['path', {
  d: 'M21 17v2a2 2 0 0 1-2 2h-2',
  key: '6vwrx8'
}], ['path', {
  d: 'M7 21H5a2 2 0 0 1-2-2v-2',
  key: 'ioqczr'
}], ['path', {
  d: 'M8 14s1.5 2 4 2 4-2 4-2',
  key: '1y1vjs'
}], ['path', {
  d: 'M9 9h.01',
  key: '1q5me6'
}], ['path', {
  d: 'M15 9h.01',
  key: 'x1ddxp'
}]]);
var ScanFace$1 = ScanFace;

var ScanLine = createReactComponent('ScanLine', [['path', {
  d: 'M3 7V5a2 2 0 0 1 2-2h2',
  key: 'aa7l1z'
}], ['path', {
  d: 'M17 3h2a2 2 0 0 1 2 2v2',
  key: '4qcy5o'
}], ['path', {
  d: 'M21 17v2a2 2 0 0 1-2 2h-2',
  key: '6vwrx8'
}], ['path', {
  d: 'M7 21H5a2 2 0 0 1-2-2v-2',
  key: 'ioqczr'
}], ['line', {
  x1: '7',
  y1: '12',
  x2: '17',
  y2: '12',
  key: 'bc9tui'
}]]);
var ScanLine$1 = ScanLine;

var Scan = createReactComponent('Scan', [['path', {
  d: 'M3 7V5a2 2 0 0 1 2-2h2',
  key: 'aa7l1z'
}], ['path', {
  d: 'M17 3h2a2 2 0 0 1 2 2v2',
  key: '4qcy5o'
}], ['path', {
  d: 'M21 17v2a2 2 0 0 1-2 2h-2',
  key: '6vwrx8'
}], ['path', {
  d: 'M7 21H5a2 2 0 0 1-2-2v-2',
  key: 'ioqczr'
}]]);
var Scan$1 = Scan;

var Scissors = createReactComponent('Scissors', [['circle', {
  cx: '6',
  cy: '6',
  r: '3',
  key: '1lh9wr'
}], ['circle', {
  cx: '6',
  cy: '18',
  r: '3',
  key: 'fqmcym'
}], ['line', {
  x1: '20',
  y1: '4',
  x2: '8.12',
  y2: '15.88',
  key: '3cwkde'
}], ['line', {
  x1: '14.47',
  y1: '14.48',
  x2: '20',
  y2: '20',
  key: '1keerz'
}], ['line', {
  x1: '8.12',
  y1: '8.12',
  x2: '12',
  y2: '12',
  key: 'spxzcb'
}]]);
var Scissors$1 = Scissors;

var ScreenShareOff = createReactComponent('ScreenShareOff', [['path', {
  d: 'M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3',
  key: 'i8wdob'
}], ['path', {
  d: 'M8 21h8',
  key: '1ev6f3'
}], ['path', {
  d: 'M12 17v4',
  key: '1riwvh'
}], ['path', {
  d: 'm22 3-5 5',
  key: '12jva0'
}], ['path', {
  d: 'm17 3 5 5',
  key: 'k36vhe'
}]]);
var ScreenShareOff$1 = ScreenShareOff;

var ScreenShare = createReactComponent('ScreenShare', [['path', {
  d: 'M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3',
  key: 'i8wdob'
}], ['path', {
  d: 'M8 21h8',
  key: '1ev6f3'
}], ['path', {
  d: 'M12 17v4',
  key: '1riwvh'
}], ['path', {
  d: 'm17 8 5-5',
  key: 'fqif7o'
}], ['path', {
  d: 'M17 3h5v5',
  key: '1o3tu8'
}]]);
var ScreenShare$1 = ScreenShare;

var Scroll = createReactComponent('Scroll', [['path', {
  d: 'M10 17v2a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v3h3',
  key: '1knuaj'
}], ['path', {
  d: 'M22 17v2a2 2 0 0 1-2 2H8',
  key: '62edg8'
}], ['path', {
  d: 'M19 17V5a2 2 0 0 0-2-2H4',
  key: 'zz82l3'
}], ['path', {
  d: 'M22 17H10',
  key: '1dr9mz'
}]]);
var Scroll$1 = Scroll;

var Search = createReactComponent('Search', [['circle', {
  cx: '11',
  cy: '11',
  r: '8',
  key: '4ej97u'
}], ['line', {
  x1: '21',
  y1: '21',
  x2: '16.65',
  y2: '16.65',
  key: '1p50m8'
}]]);
var Search$1 = Search;

var Send = createReactComponent('Send', [['line', {
  x1: '22',
  y1: '2',
  x2: '11',
  y2: '13',
  key: '10auo0'
}], ['polygon', {
  points: '22 2 15 22 11 13 2 9 22 2',
  key: '12uapv'
}]]);
var Send$1 = Send;

var SeparatorHorizontal = createReactComponent('SeparatorHorizontal', [['line', {
  x1: '3',
  y1: '12',
  x2: '21',
  y2: '12',
  key: '1aui40'
}], ['polyline', {
  points: '8 8 12 4 16 8',
  key: 'zo8t4w'
}], ['polyline', {
  points: '16 16 12 20 8 16',
  key: '1oyrid'
}]]);
var SeparatorHorizontal$1 = SeparatorHorizontal;

var SeparatorVertical = createReactComponent('SeparatorVertical', [['line', {
  x1: '12',
  y1: '3',
  x2: '12',
  y2: '21',
  key: 'essbwb'
}], ['polyline', {
  points: '8 8 4 12 8 16',
  key: 'bnfmv4'
}], ['polyline', {
  points: '16 16 20 12 16 8',
  key: 'u90052'
}]]);
var SeparatorVertical$1 = SeparatorVertical;

var ServerCog = createReactComponent('ServerCog', [['path', {
  d: 'M5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1',
  key: '1qm4no'
}], ['path', {
  d: 'M5 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-1',
  key: '1lpaho'
}], ['path', {
  d: 'M6 6h.01',
  key: '1utrut'
}], ['path', {
  d: 'M6 18h.01',
  key: 'uhywen'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '3',
  key: '1v7zrd'
}], ['path', {
  d: 'M12 8v1',
  key: '1rj8u4'
}], ['path', {
  d: 'M12 15v1',
  key: '1ovrzm'
}], ['path', {
  d: 'M16 12h-1',
  key: '1qpdyp'
}], ['path', {
  d: 'M9 12H8',
  key: '1l15iv'
}], ['path', {
  d: 'm15 9-.88.88',
  key: '3hwatj'
}], ['path', {
  d: 'M9.88 14.12 9 15',
  key: '13ldc9'
}], ['path', {
  d: 'm15 15-.88-.88',
  key: '45priv'
}], ['path', {
  d: 'M9.88 9.88 9 9',
  key: '1ladhj'
}]]);
var ServerCog$1 = ServerCog;

var ServerCrash = createReactComponent('ServerCrash', [['path', {
  d: 'M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2',
  key: '4b9dqc'
}], ['path', {
  d: 'M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2',
  key: '22nnkd'
}], ['path', {
  d: 'M6 6h.01',
  key: '1utrut'
}], ['path', {
  d: 'M6 18h.01',
  key: 'uhywen'
}], ['path', {
  d: 'm13 6-4 6h6l-4 6',
  key: '14hqih'
}]]);
var ServerCrash$1 = ServerCrash;

var ServerOff = createReactComponent('ServerOff', [['path', {
  d: 'M7 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5',
  key: 'bt2siv'
}], ['path', {
  d: 'M10 10 2.5 2.5C2 2 2 2.5 2 5v3a2 2 0 0 0 2 2h6z',
  key: '1hjrv1'
}], ['path', {
  d: 'M22 17v-1a2 2 0 0 0-2-2h-1',
  key: '1iynyr'
}], ['path', {
  d: 'M4 14a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16.5l1-.5.5.5-8-8H4z',
  key: '161ggg'
}], ['path', {
  d: 'M6 18h.01',
  key: 'uhywen'
}], ['path', {
  d: 'm2 2 20 20',
  key: '1ooewy'
}]]);
var ServerOff$1 = ServerOff;

var Server = createReactComponent('Server', [['rect', {
  x: '2',
  y: '2',
  width: '20',
  height: '8',
  rx: '2',
  ry: '2',
  key: 'e1v5fq'
}], ['rect', {
  x: '2',
  y: '14',
  width: '20',
  height: '8',
  rx: '2',
  ry: '2',
  key: '10c4lq'
}], ['line', {
  x1: '6',
  y1: '6',
  x2: '6.01',
  y2: '6',
  key: '1g0o6g'
}], ['line', {
  x1: '6',
  y1: '18',
  x2: '6.01',
  y2: '18',
  key: 'y2j7fo'
}]]);
var Server$1 = Server;

var Settings2 = createReactComponent('Settings2', [['path', {
  d: 'M20 7h-9',
  key: '3s1dr2'
}], ['path', {
  d: 'M14 17H5',
  key: 'gfn3mx'
}], ['circle', {
  cx: '17',
  cy: '17',
  r: '3',
  key: '18b49y'
}], ['circle', {
  cx: '7',
  cy: '7',
  r: '3',
  key: 'dfmy0x'
}]]);
var Settings2$1 = Settings2;

var Settings = createReactComponent('Settings', [['path', {
  d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
  key: '1qme2f'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '3',
  key: '1v7zrd'
}]]);
var Settings$1 = Settings;

var Share2 = createReactComponent('Share2', [['circle', {
  cx: '18',
  cy: '5',
  r: '3',
  key: 'gq8acd'
}], ['circle', {
  cx: '6',
  cy: '12',
  r: '3',
  key: 'w7nqdw'
}], ['circle', {
  cx: '18',
  cy: '19',
  r: '3',
  key: '1xt0gg'
}], ['line', {
  x1: '8.59',
  y1: '13.51',
  x2: '15.42',
  y2: '17.49',
  key: '10dsx0'
}], ['line', {
  x1: '15.41',
  y1: '6.51',
  x2: '8.59',
  y2: '10.49',
  key: '1qn9hm'
}]]);
var Share2$1 = Share2;

var Share = createReactComponent('Share', [['path', {
  d: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8',
  key: '1b2hhj'
}], ['polyline', {
  points: '16 6 12 2 8 6',
  key: 'm901s6'
}], ['line', {
  x1: '12',
  y1: '2',
  x2: '12',
  y2: '15',
  key: '1sxkij'
}]]);
var Share$1 = Share;

var Sheet = createReactComponent('Sheet', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['line', {
  x1: '3',
  y1: '9',
  x2: '21',
  y2: '9',
  key: '1uch6j'
}], ['line', {
  x1: '3',
  y1: '15',
  x2: '21',
  y2: '15',
  key: '1xojw2'
}], ['line', {
  x1: '9',
  y1: '9',
  x2: '9',
  y2: '21',
  key: 'x5ianl'
}], ['line', {
  x1: '15',
  y1: '9',
  x2: '15',
  y2: '21',
  key: '13a17d'
}]]);
var Sheet$1 = Sheet;

var ShieldAlert = createReactComponent('ShieldAlert', [['path', {
  d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  key: '3xmgem'
}], ['path', {
  d: 'M12 8v4',
  key: '1got3b'
}], ['path', {
  d: 'M12 16h.01',
  key: '1drbdi'
}]]);
var ShieldAlert$1 = ShieldAlert;

var ShieldCheck = createReactComponent('ShieldCheck', [['path', {
  d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  key: '3xmgem'
}], ['path', {
  d: 'm9 12 2 2 4-4',
  key: 'dzmm74'
}]]);
var ShieldCheck$1 = ShieldCheck;

var ShieldClose = createReactComponent('ShieldClose', [['path', {
  d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  key: '3xmgem'
}], ['line', {
  x1: '9.5',
  y1: '9',
  x2: '14.5',
  y2: '14',
  key: '154127'
}], ['line', {
  x1: '14.5',
  y1: '9',
  x2: '9.5',
  y2: '14',
  key: '1rm6h8'
}]]);
var ShieldClose$1 = ShieldClose;

var ShieldOff = createReactComponent('ShieldOff', [['path', {
  d: 'M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18',
  key: 'ungvgc'
}], ['path', {
  d: 'M4.73 4.73 4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38',
  key: '1qf5yw'
}], ['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}]]);
var ShieldOff$1 = ShieldOff;

var Shield = createReactComponent('Shield', [['path', {
  d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  key: '3xmgem'
}]]);
var Shield$1 = Shield;

var Shirt = createReactComponent('Shirt', [['path', {
  d: 'M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z',
  key: '1wgbhj'
}]]);
var Shirt$1 = Shirt;

var ShoppingBag = createReactComponent('ShoppingBag', [['path', {
  d: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z',
  key: '14a4hr'
}], ['line', {
  x1: '3',
  y1: '6',
  x2: '21',
  y2: '6',
  key: '1tp2lp'
}], ['path', {
  d: 'M16 10a4 4 0 0 1-8 0',
  key: '1ltviw'
}]]);
var ShoppingBag$1 = ShoppingBag;

var ShoppingCart = createReactComponent('ShoppingCart', [['circle', {
  cx: '8',
  cy: '21',
  r: '1',
  key: 'jimo8o'
}], ['circle', {
  cx: '19',
  cy: '21',
  r: '1',
  key: '13723u'
}], ['path', {
  d: 'M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12',
  key: '9zh506'
}]]);
var ShoppingCart$1 = ShoppingCart;

var Shovel = createReactComponent('Shovel', [['path', {
  d: 'M2 22v-5l5-5 5 5-5 5z',
  key: '1fh25c'
}], ['path', {
  d: 'M9.5 14.5 16 8',
  key: '1smz5x'
}], ['path', {
  d: 'm17 2 5 5-.5.5a3.53 3.53 0 0 1-5 0s0 0 0 0a3.53 3.53 0 0 1 0-5L17 2',
  key: '1q8uv5'
}]]);
var Shovel$1 = Shovel;

var ShowerHead = createReactComponent('ShowerHead', [['path', {
  d: 'm4 4 2.5 2.5',
  key: 'uv2vmf'
}], ['path', {
  d: 'M13.5 6.5a4.95 4.95 0 0 0-7 7',
  key: 'frdkwv'
}], ['path', {
  d: 'M15 5 5 15',
  key: '1ag8rq'
}], ['path', {
  d: 'M14 17v.01',
  key: 'eokfpp'
}], ['path', {
  d: 'M10 16v.01',
  key: '14uyyl'
}], ['path', {
  d: 'M13 13v.01',
  key: '1v1k97'
}], ['path', {
  d: 'M16 10v.01',
  key: '5169yg'
}], ['path', {
  d: 'M11 20v.01',
  key: 'cj92p8'
}], ['path', {
  d: 'M17 14v.01',
  key: '11cswd'
}], ['path', {
  d: 'M20 11v.01',
  key: '19e0od'
}]]);
var ShowerHead$1 = ShowerHead;

var Shrink = createReactComponent('Shrink', [['path', {
  d: 'm15 15 6 6m-6-6v4.8m0-4.8h4.8',
  key: '17vawe'
}], ['path', {
  d: 'M9 19.8V15m0 0H4.2M9 15l-6 6',
  key: 'chjx8e'
}], ['path', {
  d: 'M15 4.2V9m0 0h4.8M15 9l6-6',
  key: 'lav6yq'
}], ['path', {
  d: 'M9 4.2V9m0 0H4.2M9 9 3 3',
  key: '1pxi2q'
}]]);
var Shrink$1 = Shrink;

var Shrub = createReactComponent('Shrub', [['path', {
  d: 'M12 22v-7l-2-2',
  key: 'eqv9mc'
}], ['path', {
  d: 'M17 8v.8A6 6 0 0 1 13.8 20v0H10v0A6.5 6.5 0 0 1 7 8h0a5 5 0 0 1 10 0Z',
  key: '12jcau'
}], ['path', {
  d: 'm14 14-2 2',
  key: '847xa2'
}]]);
var Shrub$1 = Shrub;

var Shuffle = createReactComponent('Shuffle', [['polyline', {
  points: '16 3 21 3 21 8',
  key: '11391h'
}], ['line', {
  x1: '4',
  y1: '20',
  x2: '21',
  y2: '3',
  key: 'pnd031'
}], ['polyline', {
  points: '21 16 21 21 16 21',
  key: '1j0gwc'
}], ['line', {
  x1: '15',
  y1: '15',
  x2: '21',
  y2: '21',
  key: 'ygtzor'
}], ['line', {
  x1: '4',
  y1: '4',
  x2: '9',
  y2: '9',
  key: 'q17lez'
}]]);
var Shuffle$1 = Shuffle;

var SidebarClose = createReactComponent('SidebarClose', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['path', {
  d: 'M9 3v18',
  key: 'fh3hqa'
}], ['path', {
  d: 'm16 15-3-3 3-3',
  key: '14y99z'
}]]);
var SidebarClose$1 = SidebarClose;

var SidebarOpen = createReactComponent('SidebarOpen', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['path', {
  d: 'M9 3v18',
  key: 'fh3hqa'
}], ['path', {
  d: 'm14 9 3 3-3 3',
  key: '8010ee'
}]]);
var SidebarOpen$1 = SidebarOpen;

var Sidebar = createReactComponent('Sidebar', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['line', {
  x1: '9',
  y1: '3',
  x2: '9',
  y2: '21',
  key: 'nvcl17'
}]]);
var Sidebar$1 = Sidebar;

var Sigma = createReactComponent('Sigma', [['path', {
  d: 'M18 7V4H6l6 8-6 8h12v-3',
  key: 'zis8ev'
}]]);
var Sigma$1 = Sigma;

var SignalHigh = createReactComponent('SignalHigh', [['path', {
  d: 'M2 20h.01',
  key: '4haj6o'
}], ['path', {
  d: 'M7 20v-4',
  key: 'j294jx'
}], ['path', {
  d: 'M12 20v-8',
  key: 'i3yub9'
}], ['path', {
  d: 'M17 20V8',
  key: '1tkaf5'
}]]);
var SignalHigh$1 = SignalHigh;

var SignalLow = createReactComponent('SignalLow', [['path', {
  d: 'M2 20h.01',
  key: '4haj6o'
}], ['path', {
  d: 'M7 20v-4',
  key: 'j294jx'
}]]);
var SignalLow$1 = SignalLow;

var SignalMedium = createReactComponent('SignalMedium', [['path', {
  d: 'M2 20h.01',
  key: '4haj6o'
}], ['path', {
  d: 'M7 20v-4',
  key: 'j294jx'
}], ['path', {
  d: 'M12 20v-8',
  key: 'i3yub9'
}]]);
var SignalMedium$1 = SignalMedium;

var SignalZero = createReactComponent('SignalZero', [['path', {
  d: 'M2 20h.01',
  key: '4haj6o'
}]]);
var SignalZero$1 = SignalZero;

var Signal = createReactComponent('Signal', [['path', {
  d: 'M2 20h.01',
  key: '4haj6o'
}], ['path', {
  d: 'M7 20v-4',
  key: 'j294jx'
}], ['path', {
  d: 'M12 20v-8',
  key: 'i3yub9'
}], ['path', {
  d: 'M17 20V8',
  key: '1tkaf5'
}], ['path', {
  d: 'M22 4v16',
  key: 'sih9yq'
}]]);
var Signal$1 = Signal;

var Siren = createReactComponent('Siren', [['path', {
  d: 'M7 12a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v6H7v-6Z',
  key: 'rmc51c'
}], ['path', {
  d: 'M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2H5v-2Z',
  key: 'yyvmjy'
}], ['path', {
  d: 'M21 12h1',
  key: 'jtio3y'
}], ['path', {
  d: 'M18.5 4.5 18 5',
  key: 'g5sp9y'
}], ['path', {
  d: 'M2 12h1',
  key: '1uaihz'
}], ['path', {
  d: 'M12 2v1',
  key: '11qlp1'
}], ['path', {
  d: 'm4.929 4.929.707.707',
  key: '1i51kw'
}], ['path', {
  d: 'M12 12v6',
  key: '3ahymv'
}]]);
var Siren$1 = Siren;

var SkipBack = createReactComponent('SkipBack', [['polygon', {
  points: '19 20 9 12 19 4 19 20',
  key: 'o2sva'
}], ['line', {
  x1: '5',
  y1: '19',
  x2: '5',
  y2: '5',
  key: '1qxvzh'
}]]);
var SkipBack$1 = SkipBack;

var SkipForward = createReactComponent('SkipForward', [['polygon', {
  points: '5 4 15 12 5 20 5 4',
  key: '16p6eg'
}], ['line', {
  x1: '19',
  y1: '5',
  x2: '19',
  y2: '19',
  key: '5lndli'
}]]);
var SkipForward$1 = SkipForward;

var Skull = createReactComponent('Skull', [['circle', {
  cx: '9',
  cy: '12',
  r: '1',
  key: '1vctgf'
}], ['circle', {
  cx: '15',
  cy: '12',
  r: '1',
  key: '1tmaij'
}], ['path', {
  d: 'M8 20v2h8v-2',
  key: 'ded4og'
}], ['path', {
  d: 'm12.5 17-.5-1-.5 1h1z',
  key: '3me087'
}], ['path', {
  d: 'M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20',
  key: 'xq9p5u'
}]]);
var Skull$1 = Skull;

var Slack = createReactComponent('Slack', [['rect', {
  x: '13',
  y: '2',
  width: '3',
  height: '8',
  rx: '1.5',
  key: '134gbe'
}], ['path', {
  d: 'M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5',
  key: '183iwg'
}], ['rect', {
  x: '8',
  y: '14',
  width: '3',
  height: '8',
  rx: '1.5',
  key: '6p48jh'
}], ['path', {
  d: 'M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5',
  key: '76g71w'
}], ['rect', {
  x: '14',
  y: '13',
  width: '8',
  height: '3',
  rx: '1.5',
  key: '1gabf9'
}], ['path', {
  d: 'M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5',
  key: 'jc4sz0'
}], ['rect', {
  x: '2',
  y: '8',
  width: '8',
  height: '3',
  rx: '1.5',
  key: '1bingn'
}], ['path', {
  d: 'M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5',
  key: '16f3cl'
}]]);
var Slack$1 = Slack;

var Slash = createReactComponent('Slash', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['line', {
  x1: '4.93',
  y1: '4.93',
  x2: '19.07',
  y2: '19.07',
  key: 'bqqkff'
}]]);
var Slash$1 = Slash;

var Slice = createReactComponent('Slice', [['path', {
  d: 'm8 14-6 6h9v-3',
  key: 'zo3j9a'
}], ['path', {
  d: 'M18.37 3.63 8 14l3 3L21.37 6.63a2.12 2.12 0 1 0-3-3Z',
  key: '1dzx0j'
}]]);
var Slice$1 = Slice;

var SlidersHorizontal = createReactComponent('SlidersHorizontal', [['line', {
  x1: '21',
  y1: '4',
  x2: '14',
  y2: '4',
  key: 'ujuyh9'
}], ['line', {
  x1: '10',
  y1: '4',
  x2: '3',
  y2: '4',
  key: '5ejmvt'
}], ['line', {
  x1: '21',
  y1: '12',
  x2: '12',
  y2: '12',
  key: 'inadxn'
}], ['line', {
  x1: '8',
  y1: '12',
  x2: '3',
  y2: '12',
  key: 'apa8u8'
}], ['line', {
  x1: '21',
  y1: '20',
  x2: '16',
  y2: '20',
  key: 'w4k2j3'
}], ['line', {
  x1: '12',
  y1: '20',
  x2: '3',
  y2: '20',
  key: '15hqih'
}], ['line', {
  x1: '14',
  y1: '2',
  x2: '14',
  y2: '6',
  key: '19ksk4'
}], ['line', {
  x1: '8',
  y1: '10',
  x2: '8',
  y2: '14',
  key: '1cn0zn'
}], ['line', {
  x1: '16',
  y1: '18',
  x2: '16',
  y2: '22',
  key: '1vfncj'
}]]);
var SlidersHorizontal$1 = SlidersHorizontal;

var Sliders = createReactComponent('Sliders', [['line', {
  x1: '4',
  y1: '21',
  x2: '4',
  y2: '14',
  key: '2cpl65'
}], ['line', {
  x1: '4',
  y1: '10',
  x2: '4',
  y2: '3',
  key: '1b26kg'
}], ['line', {
  x1: '12',
  y1: '21',
  x2: '12',
  y2: '12',
  key: 'fxobwr'
}], ['line', {
  x1: '12',
  y1: '8',
  x2: '12',
  y2: '3',
  key: 'bkspcw'
}], ['line', {
  x1: '20',
  y1: '21',
  x2: '20',
  y2: '16',
  key: 'b7lt1r'
}], ['line', {
  x1: '20',
  y1: '12',
  x2: '20',
  y2: '3',
  key: 'inamez'
}], ['line', {
  x1: '2',
  y1: '14',
  x2: '6',
  y2: '14',
  key: 'tezuxb'
}], ['line', {
  x1: '10',
  y1: '8',
  x2: '14',
  y2: '8',
  key: '1w8tme'
}], ['line', {
  x1: '18',
  y1: '16',
  x2: '22',
  y2: '16',
  key: '1gnq8h'
}]]);
var Sliders$1 = Sliders;

var SmartphoneCharging = createReactComponent('SmartphoneCharging', [['rect', {
  x: '5',
  y: '2',
  width: '14',
  height: '20',
  rx: '2',
  ry: '2',
  key: '1gcc4z'
}], ['path', {
  d: 'M12.667 8 10 12h4l-2.667 4',
  key: 'h9lk2d'
}]]);
var SmartphoneCharging$1 = SmartphoneCharging;

var Smartphone = createReactComponent('Smartphone', [['rect', {
  x: '5',
  y: '2',
  width: '14',
  height: '20',
  rx: '2',
  ry: '2',
  key: '1gcc4z'
}], ['path', {
  d: 'M12 18h.01',
  key: 'mhygvu'
}]]);
var Smartphone$1 = Smartphone;

var SmilePlus = createReactComponent('SmilePlus', [['path', {
  d: 'M22 11v1a10 10 0 1 1-9-10',
  key: 'ew0xw9'
}], ['path', {
  d: 'M8 14s1.5 2 4 2 4-2 4-2',
  key: '1y1vjs'
}], ['line', {
  x1: '9',
  y1: '9',
  x2: '9.01',
  y2: '9',
  key: '141aaf'
}], ['line', {
  x1: '15',
  y1: '9',
  x2: '15.01',
  y2: '9',
  key: '1cyg3o'
}], ['path', {
  d: 'M16 5h6',
  key: '1vod17'
}], ['path', {
  d: 'M19 2v6',
  key: '4bpg5p'
}]]);
var SmilePlus$1 = SmilePlus;

var Smile = createReactComponent('Smile', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['path', {
  d: 'M8 14s1.5 2 4 2 4-2 4-2',
  key: '1y1vjs'
}], ['line', {
  x1: '9',
  y1: '9',
  x2: '9.01',
  y2: '9',
  key: '141aaf'
}], ['line', {
  x1: '15',
  y1: '9',
  x2: '15.01',
  y2: '9',
  key: '1cyg3o'
}]]);
var Smile$1 = Smile;

var Snowflake = createReactComponent('Snowflake', [['line', {
  x1: '2',
  y1: '12',
  x2: '22',
  y2: '12',
  key: 'zvmn4p'
}], ['line', {
  x1: '12',
  y1: '2',
  x2: '12',
  y2: '22',
  key: '1k6o5o'
}], ['path', {
  d: 'm20 16-4-4 4-4',
  key: 'rquw4f'
}], ['path', {
  d: 'm4 8 4 4-4 4',
  key: '12s3z9'
}], ['path', {
  d: 'm16 4-4 4-4-4',
  key: '1tumq1'
}], ['path', {
  d: 'm8 20 4-4 4 4',
  key: '9p200w'
}]]);
var Snowflake$1 = Snowflake;

var Sofa = createReactComponent('Sofa', [['path', {
  d: 'M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3',
  key: '1dgpiv'
}], ['path', {
  d: 'M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z',
  key: 'u5qfb7'
}], ['path', {
  d: 'M4 18v2',
  key: 'jwo5n2'
}], ['path', {
  d: 'M20 18v2',
  key: '1ar1qi'
}], ['path', {
  d: 'M12 4v9',
  key: 'oqhhn3'
}]]);
var Sofa$1 = Sofa;

var SortAsc = createReactComponent('SortAsc', [['path', {
  d: 'M11 11H15',
  key: '13b0h1'
}], ['path', {
  d: 'M11 15H18',
  key: '14lp16'
}], ['path', {
  d: 'M11 19H21',
  key: '1cy3wr'
}], ['path', {
  d: 'M9 7L6 4L3 7',
  key: 'bjdqf3'
}], ['path', {
  d: 'M6 6L6 20',
  key: '1aagpo'
}]]);
var SortAsc$1 = SortAsc;

var SortDesc = createReactComponent('SortDesc', [['path', {
  d: 'M11 5h10',
  key: '1cz7ny'
}], ['path', {
  d: 'M11 9h7',
  key: '13ra05'
}], ['path', {
  d: 'M11 13h4',
  key: '1p7l4v'
}], ['path', {
  d: 'm3 17 3 3 3-3',
  key: 'd2bl7z'
}], ['path', {
  d: 'M6 18V4',
  key: '20vmay'
}]]);
var SortDesc$1 = SortDesc;

var Speaker = createReactComponent('Speaker', [['rect', {
  x: '4',
  y: '2',
  width: '16',
  height: '20',
  rx: '2',
  ry: '2',
  key: '152kg8'
}], ['circle', {
  cx: '12',
  cy: '14',
  r: '4',
  key: '1jruaj'
}], ['line', {
  x1: '12',
  y1: '6',
  x2: '12.01',
  y2: '6',
  key: 'fpk8as'
}]]);
var Speaker$1 = Speaker;

var Sprout = createReactComponent('Sprout', [['path', {
  d: 'M7 20h10',
  key: 'e6iznv'
}], ['path', {
  d: 'M10 20c5.5-2.5.8-6.4 3-10',
  key: '161w41'
}], ['path', {
  d: 'M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z',
  key: '9gtqwd'
}], ['path', {
  d: 'M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z',
  key: 'bkxnd2'
}]]);
var Sprout$1 = Sprout;

var Square = createReactComponent('Square', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}]]);
var Square$1 = Square;

var StarHalf = createReactComponent('StarHalf', [['path', {
  d: 'M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2',
  key: 'nare05'
}]]);
var StarHalf$1 = StarHalf;

var StarOff = createReactComponent('StarOff', [['path', {
  d: 'M8.34 8.34 2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-.59-3.43',
  key: '16m0ql'
}], ['path', {
  d: 'M18.42 12.76 22 9.27l-6.91-1L12 2l-1.44 2.91',
  key: '1vt8nq'
}], ['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}]]);
var StarOff$1 = StarOff;

var Star = createReactComponent('Star', [['polygon', {
  points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2',
  key: '8f66p6'
}]]);
var Star$1 = Star;

var Stethoscope = createReactComponent('Stethoscope', [['path', {
  d: 'M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3',
  key: '1jd90r'
}], ['path', {
  d: 'M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4',
  key: '126ukv'
}], ['circle', {
  cx: '20',
  cy: '10',
  r: '2',
  key: 'ts1r5v'
}]]);
var Stethoscope$1 = Stethoscope;

var Sticker = createReactComponent('Sticker', [['path', {
  d: 'M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z',
  key: '1wis1t'
}], ['path', {
  d: 'M15 3v6h6',
  key: 'edgan2'
}], ['path', {
  d: 'M10 16s.8 1 2 1c1.3 0 2-1 2-1',
  key: '1vvgv3'
}], ['path', {
  d: 'M8 13h0',
  key: 'jdup5h'
}], ['path', {
  d: 'M16 13h0',
  key: 'l4i2ga'
}]]);
var Sticker$1 = Sticker;

var StickyNote = createReactComponent('StickyNote', [['path', {
  d: 'M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z',
  key: '1wis1t'
}], ['path', {
  d: 'M15 3v6h6',
  key: 'edgan2'
}]]);
var StickyNote$1 = StickyNote;

var StopCircle = createReactComponent('StopCircle', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['rect', {
  x: '9',
  y: '9',
  width: '6',
  height: '6',
  key: 'o3kz5p'
}]]);
var StopCircle$1 = StopCircle;

var StretchHorizontal = createReactComponent('StretchHorizontal', [['rect', {
  x: '2',
  y: '4',
  width: '20',
  height: '6',
  rx: '2',
  key: '12sjy4'
}], ['rect', {
  x: '2',
  y: '14',
  width: '20',
  height: '6',
  rx: '2',
  key: 'lnm6uo'
}]]);
var StretchHorizontal$1 = StretchHorizontal;

var StretchVertical = createReactComponent('StretchVertical', [['rect', {
  x: '4',
  y: '2',
  width: '6',
  height: '20',
  rx: '2',
  key: '1lym67'
}], ['rect', {
  x: '14',
  y: '2',
  width: '6',
  height: '20',
  rx: '2',
  key: 'b7v5o0'
}]]);
var StretchVertical$1 = StretchVertical;

var Strikethrough = createReactComponent('Strikethrough', [['path', {
  d: 'M16 4H9a3 3 0 0 0-2.83 4',
  key: '43sutm'
}], ['path', {
  d: 'M14 12a4 4 0 0 1 0 8H6',
  key: 'nlfj13'
}], ['line', {
  x1: '4',
  y1: '12',
  x2: '20',
  y2: '12',
  key: '1q6rtp'
}]]);
var Strikethrough$1 = Strikethrough;

var Subscript = createReactComponent('Subscript', [['path', {
  d: 'm4 5 8 8',
  key: '1eunvl'
}], ['path', {
  d: 'm12 5-8 8',
  key: '1ah0jp'
}], ['path', {
  d: 'M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07',
  key: 'e8ta8j'
}]]);
var Subscript$1 = Subscript;

var SunDim = createReactComponent('SunDim', [['path', {
  d: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  key: '1r4kox'
}], ['path', {
  d: 'M12 4h.01',
  key: '1ujb9j'
}], ['path', {
  d: 'M20 12h.01',
  key: '1ykeid'
}], ['path', {
  d: 'M12 20h.01',
  key: 'zekei9'
}], ['path', {
  d: 'M4 12h.01',
  key: '158zrr'
}], ['path', {
  d: 'M17.657 6.343h.01',
  key: '31pqzk'
}], ['path', {
  d: 'M17.657 17.657h.01',
  key: 'jehnf4'
}], ['path', {
  d: 'M6.343 17.657h.01',
  key: 'gdk6ow'
}], ['path', {
  d: 'M6.343 6.343h.01',
  key: '1uurf0'
}]]);
var SunDim$1 = SunDim;

var SunMedium = createReactComponent('SunMedium', [['path', {
  d: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  key: '1r4kox'
}], ['path', {
  d: 'M12 3v1',
  key: '1asbbs'
}], ['path', {
  d: 'M12 20v1',
  key: '1wcdkc'
}], ['path', {
  d: 'M3 12h1',
  key: 'lp3yf2'
}], ['path', {
  d: 'M20 12h1',
  key: '1vloll'
}], ['path', {
  d: 'm18.364 5.636-.707.707',
  key: '1hakh0'
}], ['path', {
  d: 'm6.343 17.657-.707.707',
  key: '18m9nf'
}], ['path', {
  d: 'm5.636 5.636.707.707',
  key: '1xv1c5'
}], ['path', {
  d: 'm17.657 17.657.707.707',
  key: 'vl76zb'
}]]);
var SunMedium$1 = SunMedium;

var SunMoon = createReactComponent('SunMoon', [['path', {
  d: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  key: '1r4kox'
}], ['path', {
  d: 'M12 8a2.828 2.828 0 1 0 4 4',
  key: '16688u'
}], ['path', {
  d: 'M12 2v2',
  key: 'tus03m'
}], ['path', {
  d: 'M12 20v2',
  key: '1lh1kg'
}], ['path', {
  d: 'm4.93 4.93 1.41 1.41',
  key: '149t6j'
}], ['path', {
  d: 'm17.66 17.66 1.41 1.41',
  key: 'ptbguv'
}], ['path', {
  d: 'M2 12h2',
  key: '1t8f8n'
}], ['path', {
  d: 'M20 12h2',
  key: '1q8mjw'
}], ['path', {
  d: 'm6.34 17.66-1.41 1.41',
  key: '1m8zz5'
}], ['path', {
  d: 'm19.07 4.93-1.41 1.41',
  key: '1shlcs'
}]]);
var SunMoon$1 = SunMoon;

var SunSnow = createReactComponent('SunSnow', [['path', {
  d: 'M10 9a3 3 0 1 0 0 6',
  key: '6zmtdl'
}], ['path', {
  d: 'M2 12h1',
  key: '1uaihz'
}], ['path', {
  d: 'M14 21V3',
  key: '1llu3z'
}], ['path', {
  d: 'M10 4V3',
  key: 'pkzwkn'
}], ['path', {
  d: 'M10 21v-1',
  key: '1u8rkd'
}], ['path', {
  d: 'm3.64 18.36.7-.7',
  key: '105rm9'
}], ['path', {
  d: 'm4.34 6.34-.7-.7',
  key: 'd3unjp'
}], ['path', {
  d: 'M14 12h8',
  key: '4f43i9'
}], ['path', {
  d: 'm17 4-3 3',
  key: '15jcng'
}], ['path', {
  d: 'm14 17 3 3',
  key: '6tlq38'
}], ['path', {
  d: 'm21 15-3-3 3-3',
  key: '1nlnje'
}]]);
var SunSnow$1 = SunSnow;

var Sun = createReactComponent('Sun', [['circle', {
  cx: '12',
  cy: '12',
  r: '4',
  key: '4exip2'
}], ['path', {
  d: 'M12 2v2',
  key: 'tus03m'
}], ['path', {
  d: 'M12 20v2',
  key: '1lh1kg'
}], ['path', {
  d: 'm4.93 4.93 1.41 1.41',
  key: '149t6j'
}], ['path', {
  d: 'm17.66 17.66 1.41 1.41',
  key: 'ptbguv'
}], ['path', {
  d: 'M2 12h2',
  key: '1t8f8n'
}], ['path', {
  d: 'M20 12h2',
  key: '1q8mjw'
}], ['path', {
  d: 'm6.34 17.66-1.41 1.41',
  key: '1m8zz5'
}], ['path', {
  d: 'm19.07 4.93-1.41 1.41',
  key: '1shlcs'
}]]);
var Sun$1 = Sun;

var Sunrise = createReactComponent('Sunrise', [['path', {
  d: 'M12 2v8',
  key: '1q4o3n'
}], ['path', {
  d: 'm4.93 10.93 1.41 1.41',
  key: '2a7f42'
}], ['path', {
  d: 'M2 18h2',
  key: 'j10viu'
}], ['path', {
  d: 'M20 18h2',
  key: 'wocana'
}], ['path', {
  d: 'm19.07 10.93-1.41 1.41',
  key: '15zs5n'
}], ['path', {
  d: 'M22 22H2',
  key: '19qnx5'
}], ['path', {
  d: 'm8 6 4-4 4 4',
  key: 'ybng9g'
}], ['path', {
  d: 'M16 18a4 4 0 0 0-8 0',
  key: '1lzouq'
}]]);
var Sunrise$1 = Sunrise;

var Sunset = createReactComponent('Sunset', [['path', {
  d: 'M12 10V2',
  key: '16sf7g'
}], ['path', {
  d: 'm4.93 10.93 1.41 1.41',
  key: '2a7f42'
}], ['path', {
  d: 'M2 18h2',
  key: 'j10viu'
}], ['path', {
  d: 'M20 18h2',
  key: 'wocana'
}], ['path', {
  d: 'm19.07 10.93-1.41 1.41',
  key: '15zs5n'
}], ['path', {
  d: 'M22 22H2',
  key: '19qnx5'
}], ['path', {
  d: 'm16 6-4 4-4-4',
  key: '6wukr'
}], ['path', {
  d: 'M16 18a4 4 0 0 0-8 0',
  key: '1lzouq'
}]]);
var Sunset$1 = Sunset;

var Superscript = createReactComponent('Superscript', [['path', {
  d: 'm4 19 8-8',
  key: 'hr47gm'
}], ['path', {
  d: 'm12 19-8-8',
  key: '1dhhmo'
}], ['path', {
  d: 'M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06',
  key: '1dfcux'
}]]);
var Superscript$1 = Superscript;

var SwissFranc = createReactComponent('SwissFranc', [['path', {
  d: 'M10 21V3h8',
  key: 'br2l0g'
}], ['path', {
  d: 'M6 16h9',
  key: '2py0wn'
}], ['path', {
  d: 'M10 9.5h7',
  key: '13dmhz'
}]]);
var SwissFranc$1 = SwissFranc;

var SwitchCamera = createReactComponent('SwitchCamera', [['path', {
  d: 'M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5',
  key: 'mtk2lu'
}], ['path', {
  d: 'M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5',
  key: '120jsl'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '3',
  key: '1v7zrd'
}], ['path', {
  d: 'm18 22-3-3 3-3',
  key: 'kgdoj7'
}], ['path', {
  d: 'm6 2 3 3-3 3',
  key: '1fnbkv'
}]]);
var SwitchCamera$1 = SwitchCamera;

var Sword = createReactComponent('Sword', [['polyline', {
  points: '14.5 17.5 3 6 3 3 6 3 17.5 14.5',
  key: '1hfsw2'
}], ['line', {
  x1: '13',
  y1: '19',
  x2: '19',
  y2: '13',
  key: '7h9f57'
}], ['line', {
  x1: '16',
  y1: '16',
  x2: '20',
  y2: '20',
  key: '1b4zco'
}], ['line', {
  x1: '19',
  y1: '21',
  x2: '21',
  y2: '19',
  key: 'df24kr'
}]]);
var Sword$1 = Sword;

var Swords = createReactComponent('Swords', [['polyline', {
  points: '14.5 17.5 3 6 3 3 6 3 17.5 14.5',
  key: '1hfsw2'
}], ['line', {
  x1: '13',
  y1: '19',
  x2: '19',
  y2: '13',
  key: '7h9f57'
}], ['line', {
  x1: '16',
  y1: '16',
  x2: '20',
  y2: '20',
  key: '1b4zco'
}], ['line', {
  x1: '19',
  y1: '21',
  x2: '21',
  y2: '19',
  key: 'df24kr'
}], ['polyline', {
  points: '14.5 6.5 18 3 21 3 21 6 17.5 9.5',
  key: 'hbey2j'
}], ['line', {
  x1: '5',
  y1: '14',
  x2: '9',
  y2: '18',
  key: 'acydkb'
}], ['line', {
  x1: '7',
  y1: '17',
  x2: '4',
  y2: '20',
  key: '1vmq9v'
}], ['line', {
  x1: '3',
  y1: '19',
  x2: '5',
  y2: '21',
  key: '139kw4'
}]]);
var Swords$1 = Swords;

var Syringe = createReactComponent('Syringe', [['path', {
  d: 'm18 2 4 4',
  key: '22kx64'
}], ['path', {
  d: 'm17 7 3-3',
  key: '1w1zoj'
}], ['path', {
  d: 'M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5',
  key: '1exhtz'
}], ['path', {
  d: 'm9 11 4 4',
  key: 'rovt3i'
}], ['path', {
  d: 'm5 19-3 3',
  key: '59f2uf'
}], ['path', {
  d: 'm14 4 6 6',
  key: 'yqp9t2'
}]]);
var Syringe$1 = Syringe;

var Table2 = createReactComponent('Table2', [['path', {
  d: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18',
  key: 'gugj83'
}]]);
var Table2$1 = Table2;

var Table = createReactComponent('Table', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['line', {
  x1: '3',
  y1: '9',
  x2: '21',
  y2: '9',
  key: '1uch6j'
}], ['line', {
  x1: '3',
  y1: '15',
  x2: '21',
  y2: '15',
  key: '1xojw2'
}], ['line', {
  x1: '12',
  y1: '3',
  x2: '12',
  y2: '21',
  key: 'essbwb'
}]]);
var Table$1 = Table;

var Tablet = createReactComponent('Tablet', [['rect', {
  x: '4',
  y: '2',
  width: '16',
  height: '20',
  rx: '2',
  ry: '2',
  key: '152kg8'
}], ['line', {
  x1: '12',
  y1: '18',
  x2: '12.01',
  y2: '18',
  key: '73g4n8'
}]]);
var Tablet$1 = Tablet;

var Tag = createReactComponent('Tag', [['path', {
  d: 'M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z',
  key: '14b2ls'
}], ['path', {
  d: 'M7 7h.01',
  key: '7u93v4'
}]]);
var Tag$1 = Tag;

var Tags = createReactComponent('Tags', [['path', {
  d: 'M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z',
  key: 'gt587u'
}], ['path', {
  d: 'M6 9.01V9',
  key: '1flxpt'
}], ['path', {
  d: 'm15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19',
  key: '1cbfv1'
}]]);
var Tags$1 = Tags;

var Target = createReactComponent('Target', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '6',
  key: '1vlfrh'
}], ['circle', {
  cx: '12',
  cy: '12',
  r: '2',
  key: '1c9p78'
}]]);
var Target$1 = Target;

var Tent = createReactComponent('Tent', [['path', {
  d: 'M19 20 10 4',
  key: '1ak541'
}], ['path', {
  d: 'm5 20 9-16',
  key: '11dtj9'
}], ['path', {
  d: 'M3 20h18',
  key: '1l19wn'
}], ['path', {
  d: 'm12 15-3 5',
  key: '1c5kej'
}], ['path', {
  d: 'm12 15 3 5',
  key: 'odkmhi'
}]]);
var Tent$1 = Tent;

var TerminalSquare = createReactComponent('TerminalSquare', [['path', {
  d: 'm7 11 2-2-2-2',
  key: '1lz0vl'
}], ['path', {
  d: 'M11 13h4',
  key: '1p7l4v'
}], ['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}]]);
var TerminalSquare$1 = TerminalSquare;

var Terminal = createReactComponent('Terminal', [['polyline', {
  points: '4 17 10 11 4 5',
  key: 'akl6gq'
}], ['line', {
  x1: '12',
  y1: '19',
  x2: '20',
  y2: '19',
  key: 'fyyrwq'
}]]);
var Terminal$1 = Terminal;

var TextCursorInput = createReactComponent('TextCursorInput', [['path', {
  d: 'M13 20h-1a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1',
  key: '19sqy7'
}], ['path', {
  d: 'M5 4h1a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5',
  key: '1etnvu'
}], ['path', {
  d: 'M13.1 7.9h6.8A2.18 2.18 0 0 1 22 10v4a2.11 2.11 0 0 1-2.1 2.1h-6.8',
  key: 'ebxlah'
}], ['path', {
  d: 'M4.8 16.1h-.7A2.18 2.18 0 0 1 2 14v-4a2.18 2.18 0 0 1 2.1-2.1h.7',
  key: '1l3v11'
}]]);
var TextCursorInput$1 = TextCursorInput;

var TextCursor = createReactComponent('TextCursor', [['path', {
  d: 'M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1',
  key: 'uvaxm9'
}], ['path', {
  d: 'M7 22h1a4 4 0 0 0 4-4v-1',
  key: '11xy8d'
}], ['path', {
  d: 'M7 2h1a4 4 0 0 1 4 4v1',
  key: '1uw06m'
}]]);
var TextCursor$1 = TextCursor;

var ThermometerSnowflake = createReactComponent('ThermometerSnowflake', [['path', {
  d: 'M2 12h10',
  key: '19562f'
}], ['path', {
  d: 'M9 4v16',
  key: '81ygyz'
}], ['path', {
  d: 'm3 9 3 3-3 3',
  key: '1sas0l'
}], ['path', {
  d: 'M12 6 9 9 6 6',
  key: 'pfrgxu'
}], ['path', {
  d: 'm6 18 3-3 1.5 1.5',
  key: '1e277p'
}], ['path', {
  d: 'M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z',
  key: 'iof6y5'
}]]);
var ThermometerSnowflake$1 = ThermometerSnowflake;

var ThermometerSun = createReactComponent('ThermometerSun', [['path', {
  d: 'M12 9a4 4 0 0 0-2 7.5',
  key: '1jvsq6'
}], ['path', {
  d: 'M12 3v2',
  key: '1w22ol'
}], ['path', {
  d: 'm6.6 18.4-1.4 1.4',
  key: 'w2yidj'
}], ['path', {
  d: 'M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z',
  key: 'iof6y5'
}], ['path', {
  d: 'M4 13H2',
  key: '118le4'
}], ['path', {
  d: 'M6.34 7.34 4.93 5.93',
  key: '1brd51'
}]]);
var ThermometerSun$1 = ThermometerSun;

var Thermometer = createReactComponent('Thermometer', [['path', {
  d: 'M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z',
  key: '17jzev'
}]]);
var Thermometer$1 = Thermometer;

var ThumbsDown = createReactComponent('ThumbsDown', [['path', {
  d: 'M17 14V2',
  key: '8ymqnk'
}], ['path', {
  d: 'M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z',
  key: 's6e0r'
}]]);
var ThumbsDown$1 = ThumbsDown;

var ThumbsUp = createReactComponent('ThumbsUp', [['path', {
  d: 'M7 10v12',
  key: '1qc93n'
}], ['path', {
  d: 'M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z',
  key: 'y3tblf'
}]]);
var ThumbsUp$1 = ThumbsUp;

var Ticket = createReactComponent('Ticket', [['path', {
  d: 'M3 7v2a3 3 0 1 1 0 6v2c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z',
  key: 'nswdcl'
}], ['path', {
  d: 'M13 5v2',
  key: 'dyzc3o'
}], ['path', {
  d: 'M13 17v2',
  key: '1ont0d'
}], ['path', {
  d: 'M13 11v2',
  key: '1wjjxi'
}]]);
var Ticket$1 = Ticket;

var TimerOff = createReactComponent('TimerOff', [['path', {
  d: 'M10 2h4',
  key: 'n1abiw'
}], ['path', {
  d: 'M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7',
  key: '10he05'
}], ['path', {
  d: 'M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2',
  key: '15f7sh'
}], ['path', {
  d: 'm2 2 20 20',
  key: '1ooewy'
}], ['path', {
  d: 'M12 12v-2',
  key: 'fwoke6'
}]]);
var TimerOff$1 = TimerOff;

var TimerReset = createReactComponent('TimerReset', [['path', {
  d: 'M10 2h4',
  key: 'n1abiw'
}], ['path', {
  d: 'M12 14v-4',
  key: '1evpnu'
}], ['path', {
  d: 'M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6',
  key: '1ts96g'
}], ['path', {
  d: 'M9 17H4v5',
  key: '8t5av'
}]]);
var TimerReset$1 = TimerReset;

var Timer = createReactComponent('Timer', [['line', {
  x1: '10',
  x2: '14',
  y1: '2',
  y2: '2',
  key: '14vaq8'
}], ['line', {
  x1: '12',
  x2: '15',
  y1: '14',
  y2: '11',
  key: '17fdiu'
}], ['circle', {
  cx: '12',
  cy: '14',
  r: '8',
  key: '1e1u0o'
}]]);
var Timer$1 = Timer;

var ToggleLeft = createReactComponent('ToggleLeft', [['rect', {
  x: '1',
  y: '5',
  width: '22',
  height: '14',
  rx: '7',
  ry: '7',
  key: 'rq2fx9'
}], ['circle', {
  cx: '8',
  cy: '12',
  r: '3',
  key: 'nylqfu'
}]]);
var ToggleLeft$1 = ToggleLeft;

var ToggleRight = createReactComponent('ToggleRight', [['rect', {
  x: '1',
  y: '5',
  width: '22',
  height: '14',
  rx: '7',
  ry: '7',
  key: 'rq2fx9'
}], ['circle', {
  cx: '16',
  cy: '12',
  r: '3',
  key: 'nkkl0l'
}]]);
var ToggleRight$1 = ToggleRight;

var Tornado = createReactComponent('Tornado', [['path', {
  d: 'M21 4H3',
  key: '1hwok0'
}], ['path', {
  d: 'M18 8H6',
  key: '41n648'
}], ['path', {
  d: 'M19 12H9',
  key: '1g4lpz'
}], ['path', {
  d: 'M16 16h-6',
  key: '1j5d54'
}], ['path', {
  d: 'M11 20H9',
  key: '39obr8'
}]]);
var Tornado$1 = Tornado;

var ToyBrick = createReactComponent('ToyBrick', [['rect', {
  x: '3',
  y: '8',
  width: '18',
  height: '12',
  rx: '1',
  key: '1yob91'
}], ['path', {
  d: 'M10 8V5c0-.6-.4-1-1-1H6a1 1 0 0 0-1 1v3',
  key: 's0042v'
}], ['path', {
  d: 'M19 8V5c0-.6-.4-1-1-1h-3a1 1 0 0 0-1 1v3',
  key: '9wmeh2'
}]]);
var ToyBrick$1 = ToyBrick;

var Train = createReactComponent('Train', [['rect', {
  x: '4',
  y: '3',
  width: '16',
  height: '16',
  rx: '2',
  key: 'u93jis'
}], ['path', {
  d: 'M4 11h16',
  key: 'mpoxn0'
}], ['path', {
  d: 'M12 3v8',
  key: '1h2ygw'
}], ['path', {
  d: 'm8 19-2 3',
  key: '13i0xs'
}], ['path', {
  d: 'm18 22-2-3',
  key: '1p0ohu'
}], ['path', {
  d: 'M8 15h0',
  key: 'q9eq1f'
}], ['path', {
  d: 'M16 15h0',
  key: 'pzrbjg'
}]]);
var Train$1 = Train;

var Trash2 = createReactComponent('Trash2', [['path', {
  d: 'M3 6h18',
  key: 'd0wm0j'
}], ['path', {
  d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6',
  key: '4alrt4'
}], ['path', {
  d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2',
  key: 'v07s0e'
}], ['line', {
  x1: '10',
  y1: '11',
  x2: '10',
  y2: '17',
  key: 'm9v7hp'
}], ['line', {
  x1: '14',
  y1: '11',
  x2: '14',
  y2: '17',
  key: '23cpt9'
}]]);
var Trash2$1 = Trash2;

var Trash = createReactComponent('Trash', [['path', {
  d: 'M3 6h18',
  key: 'd0wm0j'
}], ['path', {
  d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6',
  key: '4alrt4'
}], ['path', {
  d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2',
  key: 'v07s0e'
}]]);
var Trash$1 = Trash;

var TreeDeciduous = createReactComponent('TreeDeciduous', [['path', {
  d: 'M8 19h8a4 4 0 0 0 3.8-2.8 4 4 0 0 0-1.6-4.5c1-1.1 1-2.7.4-4-.7-1.2-2.2-2-3.6-1.7a3 3 0 0 0-3-3 3 3 0 0 0-3 3c-1.4-.2-2.9.5-3.6 1.7-.7 1.3-.5 2.9.4 4a4 4 0 0 0-1.6 4.5A4 4 0 0 0 8 19Z',
  key: '12ivfl'
}], ['path', {
  d: 'M12 19v3',
  key: 'npa21l'
}]]);
var TreeDeciduous$1 = TreeDeciduous;

var TreePine = createReactComponent('TreePine', [['path', {
  d: 'm17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z',
  key: 'cpyugq'
}], ['path', {
  d: 'M12 22v-3',
  key: 'kmzjlo'
}]]);
var TreePine$1 = TreePine;

var Trees = createReactComponent('Trees', [['path', {
  d: 'M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z',
  key: 'yh07w9'
}], ['path', {
  d: 'M7 16v6',
  key: '1a82de'
}], ['path', {
  d: 'M13 19v3',
  key: '13sx9i'
}], ['path', {
  d: 'M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5',
  key: '1sj9kv'
}]]);
var Trees$1 = Trees;

var Trello = createReactComponent('Trello', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['rect', {
  x: '7',
  y: '7',
  width: '3',
  height: '9',
  key: '1xk0xp'
}], ['rect', {
  x: '14',
  y: '7',
  width: '3',
  height: '5',
  key: '1otkhn'
}]]);
var Trello$1 = Trello;

var TrendingDown = createReactComponent('TrendingDown', [['polyline', {
  points: '22 17 13.5 8.5 8.5 13.5 2 7',
  key: '1r2t7k'
}], ['polyline', {
  points: '16 17 22 17 22 11',
  key: '11uiuu'
}]]);
var TrendingDown$1 = TrendingDown;

var TrendingUp = createReactComponent('TrendingUp', [['polyline', {
  points: '22 7 13.5 15.5 8.5 10.5 2 17',
  key: '126l90'
}], ['polyline', {
  points: '16 7 22 7 22 13',
  key: 'kwv8wd'
}]]);
var TrendingUp$1 = TrendingUp;

var Triangle = createReactComponent('Triangle', [['path', {
  d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z',
  key: 'c3ski4'
}]]);
var Triangle$1 = Triangle;

var Trophy = createReactComponent('Trophy', [['path', {
  d: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6',
  key: '17hqa7'
}], ['path', {
  d: 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18',
  key: 'lmptdp'
}], ['path', {
  d: 'M4 22h16',
  key: '57wxv0'
}], ['path', {
  d: 'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22',
  key: '1nw9bq'
}], ['path', {
  d: 'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22',
  key: '1np0yb'
}], ['path', {
  d: 'M18 2H6v7a6 6 0 0 0 12 0V2Z',
  key: 'u46fv3'
}]]);
var Trophy$1 = Trophy;

var Truck = createReactComponent('Truck', [['path', {
  d: 'M10 17h4V5H2v12h3',
  key: '1jq12e'
}], ['path', {
  d: 'M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5',
  key: '1xb3ft'
}], ['path', {
  d: 'M14 17h1',
  key: 'nufu4t'
}], ['circle', {
  cx: '7.5',
  cy: '17.5',
  r: '2.5',
  key: 'a7aife'
}], ['circle', {
  cx: '17.5',
  cy: '17.5',
  r: '2.5',
  key: '1mdrzq'
}]]);
var Truck$1 = Truck;

var Tv2 = createReactComponent('Tv2', [['path', {
  d: 'M7 21h10',
  key: '1b0cd5'
}], ['rect', {
  x: '2',
  y: '3',
  width: '20',
  height: '14',
  rx: '2',
  key: 'x3v2xh'
}]]);
var Tv2$1 = Tv2;

var Tv = createReactComponent('Tv', [['rect', {
  x: '2',
  y: '7',
  width: '20',
  height: '15',
  rx: '2',
  ry: '2',
  key: 'f237mn'
}], ['polyline', {
  points: '17 2 12 7 7 2',
  key: '11pgbg'
}]]);
var Tv$1 = Tv;

var Twitch = createReactComponent('Twitch', [['path', {
  d: 'M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7',
  key: 'c0yzno'
}]]);
var Twitch$1 = Twitch;

var Twitter = createReactComponent('Twitter', [['path', {
  d: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z',
  key: 'pff0z6'
}]]);
var Twitter$1 = Twitter;

var Type = createReactComponent('Type', [['polyline', {
  points: '4 7 4 4 20 4 20 7',
  key: '1nosan'
}], ['line', {
  x1: '9',
  y1: '20',
  x2: '15',
  y2: '20',
  key: '10hqwk'
}], ['line', {
  x1: '12',
  y1: '4',
  x2: '12',
  y2: '20',
  key: '8v58sd'
}]]);
var Type$1 = Type;

var Umbrella = createReactComponent('Umbrella', [['path', {
  d: 'M22 12a9.92 9.92 0 0 0-3.24-6.41 10.12 10.12 0 0 0-13.52 0A9.92 9.92 0 0 0 2 12Z',
  key: 'gyh82n'
}], ['path', {
  d: 'M12 12v8a2 2 0 0 0 4 0',
  key: 'ulpmoc'
}], ['line', {
  x1: '12',
  y1: '2',
  x2: '12',
  y2: '3',
  key: '7v6ckq'
}]]);
var Umbrella$1 = Umbrella;

var Underline = createReactComponent('Underline', [['path', {
  d: 'M6 4v6a6 6 0 0 0 12 0V4',
  key: '9kb039'
}], ['line', {
  x1: '4',
  y1: '20',
  x2: '20',
  y2: '20',
  key: 'klhyhp'
}]]);
var Underline$1 = Underline;

var Undo2 = createReactComponent('Undo2', [['path', {
  d: 'M9 14 4 9l5-5',
  key: '102s5s'
}], ['path', {
  d: 'M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11',
  key: 'llx8ln'
}]]);
var Undo2$1 = Undo2;

var Undo = createReactComponent('Undo', [['path', {
  d: 'M3 7v6h6',
  key: '1v2h90'
}], ['path', {
  d: 'M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13',
  key: '1r6uu6'
}]]);
var Undo$1 = Undo;

var Unlink2 = createReactComponent('Unlink2', [['path', {
  d: 'M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2',
  key: '1re2ne'
}]]);
var Unlink2$1 = Unlink2;

var Unlink = createReactComponent('Unlink', [['path', {
  d: 'm18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71',
  key: 'yqzxt4'
}], ['path', {
  d: 'm5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71',
  key: '4qinb0'
}], ['line', {
  x1: '8',
  y1: '2',
  x2: '8',
  y2: '5',
  key: '187dr9'
}], ['line', {
  x1: '2',
  y1: '8',
  x2: '5',
  y2: '8',
  key: 'peo5ws'
}], ['line', {
  x1: '16',
  y1: '19',
  x2: '16',
  y2: '22',
  key: '6aelkz'
}], ['line', {
  x1: '19',
  y1: '16',
  x2: '22',
  y2: '16',
  key: 'ln8io3'
}]]);
var Unlink$1 = Unlink;

var Unlock = createReactComponent('Unlock', [['rect', {
  x: '3',
  y: '11',
  width: '18',
  height: '11',
  rx: '2',
  ry: '2',
  key: 'biyj2e'
}], ['path', {
  d: 'M7 11V7a5 5 0 0 1 9.9-1',
  key: '1mm8w8'
}]]);
var Unlock$1 = Unlock;

var UploadCloud = createReactComponent('UploadCloud', [['path', {
  d: 'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242',
  key: '1pljnt'
}], ['path', {
  d: 'M12 12v9',
  key: '192myk'
}], ['path', {
  d: 'm16 16-4-4-4 4',
  key: '119tzi'
}]]);
var UploadCloud$1 = UploadCloud;

var Upload = createReactComponent('Upload', [['path', {
  d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
  key: 'ih7n3h'
}], ['polyline', {
  points: '17 8 12 3 7 8',
  key: 't8dd8p'
}], ['line', {
  x1: '12',
  y1: '3',
  x2: '12',
  y2: '15',
  key: 'wktxj0'
}]]);
var Upload$1 = Upload;

var Usb = createReactComponent('Usb', [['circle', {
  cx: '4',
  cy: '20',
  r: '1',
  key: '22iqad'
}], ['circle', {
  cx: '10',
  cy: '7',
  r: '1',
  key: 'dypaad'
}], ['path', {
  d: 'M4 20 19 5',
  key: '15hogs'
}], ['path', {
  d: 'm21 3-3 1 2 2 1-3Z',
  key: 'ew8vct'
}], ['path', {
  d: 'm10 7-5 5 2 5',
  key: '148pqf'
}], ['path', {
  d: 'm10 14 5 2 4-4',
  key: '1ivjwr'
}], ['path', {
  d: 'm18 12 1-1 1 1-1 1-1-1Z',
  key: 'tus6kn'
}]]);
var Usb$1 = Usb;

var UserCheck = createReactComponent('UserCheck', [['path', {
  d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
  key: '1yyitq'
}], ['circle', {
  cx: '9',
  cy: '7',
  r: '4',
  key: 'nufk8'
}], ['polyline', {
  points: '16 11 18 13 22 9',
  key: '1pwet4'
}]]);
var UserCheck$1 = UserCheck;

var UserCog = createReactComponent('UserCog', [['path', {
  d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
  key: '1yyitq'
}], ['circle', {
  cx: '9',
  cy: '7',
  r: '4',
  key: 'nufk8'
}], ['circle', {
  cx: '19',
  cy: '11',
  r: '2',
  key: '1rxg02'
}], ['path', {
  d: 'M19 8v1',
  key: '1iffrw'
}], ['path', {
  d: 'M19 13v1',
  key: 'z4xc62'
}], ['path', {
  d: 'm21.6 9.5-.87.5',
  key: '6lxupl'
}], ['path', {
  d: 'm17.27 12-.87.5',
  key: '1rwhxx'
}], ['path', {
  d: 'm21.6 12.5-.87-.5',
  key: 'agvc9a'
}], ['path', {
  d: 'm17.27 10-.87-.5',
  key: '12d57s'
}]]);
var UserCog$1 = UserCog;

var UserMinus = createReactComponent('UserMinus', [['path', {
  d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
  key: '1yyitq'
}], ['circle', {
  cx: '9',
  cy: '7',
  r: '4',
  key: 'nufk8'
}], ['line', {
  x1: '22',
  y1: '11',
  x2: '16',
  y2: '11',
  key: '8bk570'
}]]);
var UserMinus$1 = UserMinus;

var UserPlus = createReactComponent('UserPlus', [['path', {
  d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
  key: '1yyitq'
}], ['circle', {
  cx: '9',
  cy: '7',
  r: '4',
  key: 'nufk8'
}], ['line', {
  x1: '19',
  y1: '8',
  x2: '19',
  y2: '14',
  key: '9s353q'
}], ['line', {
  x1: '22',
  y1: '11',
  x2: '16',
  y2: '11',
  key: '8bk570'
}]]);
var UserPlus$1 = UserPlus;

var UserX = createReactComponent('UserX', [['path', {
  d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
  key: '1yyitq'
}], ['circle', {
  cx: '9',
  cy: '7',
  r: '4',
  key: 'nufk8'
}], ['line', {
  x1: '17',
  y1: '8',
  x2: '22',
  y2: '13',
  key: '10apcb'
}], ['line', {
  x1: '22',
  y1: '8',
  x2: '17',
  y2: '13',
  key: '1l8di5'
}]]);
var UserX$1 = UserX;

var User = createReactComponent('User', [['path', {
  d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2',
  key: '975kel'
}], ['circle', {
  cx: '12',
  cy: '7',
  r: '4',
  key: '17ys0d'
}]]);
var User$1 = User;

var Users = createReactComponent('Users', [['path', {
  d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
  key: '1yyitq'
}], ['circle', {
  cx: '9',
  cy: '7',
  r: '4',
  key: 'nufk8'
}], ['path', {
  d: 'M22 21v-2a4 4 0 0 0-3-3.87',
  key: 'kshegd'
}], ['path', {
  d: 'M16 3.13a4 4 0 0 1 0 7.75',
  key: '1da9ce'
}]]);
var Users$1 = Users;

var UtensilsCrossed = createReactComponent('UtensilsCrossed', [['path', {
  d: 'm16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8',
  key: 'n7qcjb'
}], ['path', {
  d: 'M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7',
  key: 'd0u48b'
}], ['path', {
  d: 'm2.1 21.8 6.4-6.3',
  key: 'yn04lh'
}], ['path', {
  d: 'm19 5-7 7',
  key: '194lzd'
}]]);
var UtensilsCrossed$1 = UtensilsCrossed;

var Utensils = createReactComponent('Utensils', [['path', {
  d: 'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2',
  key: 'cjf0a3'
}], ['path', {
  d: 'M7 2v20',
  key: '1473qp'
}], ['path', {
  d: 'M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7',
  key: '1ogz0v'
}]]);
var Utensils$1 = Utensils;

var VenetianMask = createReactComponent('VenetianMask', [['path', {
  d: 'M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z',
  key: '1g6z3j'
}], ['path', {
  d: 'M6 11c1.5 0 3 .5 3 2-2 0-3 0-3-2Z',
  key: 'c2lwnf'
}], ['path', {
  d: 'M18 11c-1.5 0-3 .5-3 2 2 0 3 0 3-2Z',
  key: 'njd9zo'
}]]);
var VenetianMask$1 = VenetianMask;

var Verified = createReactComponent('Verified', [['path', {
  d: 'M12 3c-1.2 0-2.4.6-3 1.7A3.6 3.6 0 0 0 4.6 9c-1 .6-1.7 1.8-1.7 3s.7 2.4 1.7 3c-.3 1.2 0 2.5 1 3.4.8.8 2.1 1.2 3.3 1 .6 1 1.8 1.6 3 1.6s2.4-.6 3-1.7c1.2.3 2.5 0 3.4-1 .8-.8 1.2-2 1-3.3 1-.6 1.6-1.8 1.6-3s-.6-2.4-1.7-3c.3-1.2 0-2.5-1-3.4a3.7 3.7 0 0 0-3.3-1c-.6-1-1.8-1.6-3-1.6Z',
  key: '7kujkm'
}], ['path', {
  d: 'm9 12 2 2 4-4',
  key: 'dzmm74'
}]]);
var Verified$1 = Verified;

var VibrateOff = createReactComponent('VibrateOff', [['path', {
  d: 'm2 8 2 2-2 2 2 2-2 2',
  key: 'sv1b1'
}], ['path', {
  d: 'm22 8-2 2 2 2-2 2 2 2',
  key: '101i4y'
}], ['path', {
  d: 'M8 8v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2',
  key: '1hbad5'
}], ['path', {
  d: 'M16 10.34V6c0-.55-.45-1-1-1h-4.34',
  key: '1x5tf0'
}], ['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}]]);
var VibrateOff$1 = VibrateOff;

var Vibrate = createReactComponent('Vibrate', [['path', {
  d: 'm2 8 2 2-2 2 2 2-2 2',
  key: 'sv1b1'
}], ['path', {
  d: 'm22 8-2 2 2 2-2 2 2 2',
  key: '101i4y'
}], ['rect', {
  x: '8',
  y: '5',
  width: '8',
  height: '14',
  rx: '1',
  key: 'bi6xeo'
}]]);
var Vibrate$1 = Vibrate;

var VideoOff = createReactComponent('VideoOff', [['path', {
  d: 'M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L22 8v8',
  key: 'ubwiq0'
}], ['path', {
  d: 'M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l10 10Z',
  key: '1l10zd'
}], ['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}]]);
var VideoOff$1 = VideoOff;

var Video = createReactComponent('Video', [['path', {
  d: 'm22 8-6 4 6 4V8Z',
  key: '50v9me'
}], ['rect', {
  x: '2',
  y: '6',
  width: '14',
  height: '12',
  rx: '2',
  ry: '2',
  key: '14il7g'
}]]);
var Video$1 = Video;

var View = createReactComponent('View', [['path', {
  d: 'M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z',
  key: 'vptub8'
}], ['path', {
  d: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  key: '10lhjs'
}], ['path', {
  d: 'M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2',
  key: 'mrq65r'
}], ['path', {
  d: 'M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2',
  key: 'be3xqs'
}]]);
var View$1 = View;

var Voicemail = createReactComponent('Voicemail', [['circle', {
  cx: '6',
  cy: '12',
  r: '4',
  key: '1ehtga'
}], ['circle', {
  cx: '18',
  cy: '12',
  r: '4',
  key: '4vafl8'
}], ['line', {
  x1: '6',
  y1: '16',
  x2: '18',
  y2: '16',
  key: '1xgyj1'
}]]);
var Voicemail$1 = Voicemail;

var Volume1 = createReactComponent('Volume1', [['polygon', {
  points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5',
  key: '16drj5'
}], ['path', {
  d: 'M15.54 8.46a5 5 0 0 1 0 7.07',
  key: 'ltjumu'
}]]);
var Volume1$1 = Volume1;

var Volume2 = createReactComponent('Volume2', [['polygon', {
  points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5',
  key: '16drj5'
}], ['path', {
  d: 'M15.54 8.46a5 5 0 0 1 0 7.07',
  key: 'ltjumu'
}], ['path', {
  d: 'M19.07 4.93a10 10 0 0 1 0 14.14',
  key: '1kegas'
}]]);
var Volume2$1 = Volume2;

var VolumeX = createReactComponent('VolumeX', [['polygon', {
  points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5',
  key: '16drj5'
}], ['line', {
  x1: '22',
  y1: '9',
  x2: '16',
  y2: '15',
  key: '3gspht'
}], ['line', {
  x1: '16',
  y1: '9',
  x2: '22',
  y2: '15',
  key: '2tltpt'
}]]);
var VolumeX$1 = VolumeX;

var Volume = createReactComponent('Volume', [['polygon', {
  points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5',
  key: '16drj5'
}]]);
var Volume$1 = Volume;

var Wallet = createReactComponent('Wallet', [['path', {
  d: 'M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4',
  key: 'st805m'
}], ['path', {
  d: 'M4 6v12c0 1.1.9 2 2 2h14v-4',
  key: '16cu1e'
}], ['path', {
  d: 'M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z',
  key: 'lwd56p'
}]]);
var Wallet$1 = Wallet;

var Wand2 = createReactComponent('Wand2', [['path', {
  d: 'm21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z',
  key: '1bcowg'
}], ['path', {
  d: 'm14 7 3 3',
  key: '1r5n42'
}], ['path', {
  d: 'M5 6v4',
  key: 'ilb8ba'
}], ['path', {
  d: 'M19 14v4',
  key: 'blhpug'
}], ['path', {
  d: 'M10 2v2',
  key: '7u0qdc'
}], ['path', {
  d: 'M7 8H3',
  key: 'zfb6yr'
}], ['path', {
  d: 'M21 16h-4',
  key: '1cnmox'
}], ['path', {
  d: 'M11 3H9',
  key: '1obp7u'
}]]);
var Wand2$1 = Wand2;

var Wand = createReactComponent('Wand', [['path', {
  d: 'M15 4V2',
  key: 'z1p9b7'
}], ['path', {
  d: 'M15 16v-2',
  key: 'px0unx'
}], ['path', {
  d: 'M8 9h2',
  key: '1g203m'
}], ['path', {
  d: 'M20 9h2',
  key: '19tzq7'
}], ['path', {
  d: 'M17.8 11.8 19 13',
  key: 'yihg8r'
}], ['path', {
  d: 'M15 9h0',
  key: 'kg5t1u'
}], ['path', {
  d: 'M17.8 6.2 19 5',
  key: 'fd4us0'
}], ['path', {
  d: 'm3 21 9-9',
  key: '1jfql5'
}], ['path', {
  d: 'M12.2 6.2 11 5',
  key: 'i3da3b'
}]]);
var Wand$1 = Wand;

var Watch = createReactComponent('Watch', [['circle', {
  cx: '12',
  cy: '12',
  r: '6',
  key: '1vlfrh'
}], ['polyline', {
  points: '12 10 12 12 13 13',
  key: '19dquz'
}], ['path', {
  d: 'm16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05',
  key: '18k57s'
}], ['path', {
  d: 'm7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05',
  key: '16ny36'
}]]);
var Watch$1 = Watch;

var Waves = createReactComponent('Waves', [['path', {
  d: 'M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
  key: 'knzxuh'
}], ['path', {
  d: 'M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
  key: '2jd2cc'
}], ['path', {
  d: 'M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
  key: 'rd2r6e'
}]]);
var Waves$1 = Waves;

var Webcam = createReactComponent('Webcam', [['circle', {
  cx: '12',
  cy: '10',
  r: '8',
  key: '1gshiw'
}], ['circle', {
  cx: '12',
  cy: '10',
  r: '3',
  key: 'ilqhr7'
}], ['path', {
  d: 'M7 22h10',
  key: '10w4w3'
}], ['path', {
  d: 'M12 22v-4',
  key: '1utk9m'
}]]);
var Webcam$1 = Webcam;

var Webhook = createReactComponent('Webhook', [['path', {
  d: 'M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2',
  key: 'q3hayz'
}], ['path', {
  d: 'm6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06',
  key: '1go1hn'
}], ['path', {
  d: 'm12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8',
  key: 'qlwsc0'
}]]);
var Webhook$1 = Webhook;

var WifiOff = createReactComponent('WifiOff', [['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}], ['path', {
  d: 'M8.5 16.5a5 5 0 0 1 7 0',
  key: 'sej527'
}], ['path', {
  d: 'M2 8.82a15 15 0 0 1 4.17-2.65',
  key: '11utq1'
}], ['path', {
  d: 'M10.66 5c4.01-.36 8.14.9 11.34 3.76',
  key: 'hxefdu'
}], ['path', {
  d: 'M16.85 11.25a10 10 0 0 1 2.22 1.68',
  key: 'q734kn'
}], ['path', {
  d: 'M5 13a10 10 0 0 1 5.24-2.76',
  key: 'piq4yl'
}], ['line', {
  x1: '12',
  y1: '20',
  x2: '12.01',
  y2: '20',
  key: 'wbu7xg'
}]]);
var WifiOff$1 = WifiOff;

var Wifi = createReactComponent('Wifi', [['path', {
  d: 'M5 13a10 10 0 0 1 14 0',
  key: '6v8j51'
}], ['path', {
  d: 'M8.5 16.5a5 5 0 0 1 7 0',
  key: 'sej527'
}], ['path', {
  d: 'M2 8.82a15 15 0 0 1 20 0',
  key: 'dnpr2z'
}], ['line', {
  x1: '12',
  y1: '20',
  x2: '12.01',
  y2: '20',
  key: 'wbu7xg'
}]]);
var Wifi$1 = Wifi;

var Wind = createReactComponent('Wind', [['path', {
  d: 'M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2',
  key: '1k4u03'
}], ['path', {
  d: 'M9.6 4.6A2 2 0 1 1 11 8H2',
  key: 'b7d0fd'
}], ['path', {
  d: 'M12.6 19.4A2 2 0 1 0 14 16H2',
  key: '1p5cb3'
}]]);
var Wind$1 = Wind;

var Wine = createReactComponent('Wine', [['path', {
  d: 'M8 22h8',
  key: 'rmew8v'
}], ['path', {
  d: 'M7 10h10',
  key: '1101jm'
}], ['path', {
  d: 'M12 15v7',
  key: 't2xh3l'
}], ['path', {
  d: 'M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z',
  key: '10ffi3'
}]]);
var Wine$1 = Wine;

var WrapText = createReactComponent('WrapText', [['line', {
  x1: '3',
  y1: '6',
  x2: '21',
  y2: '6',
  key: '1tp2lp'
}], ['path', {
  d: 'M3 12h15a3 3 0 1 1 0 6h-4',
  key: '1cl7v7'
}], ['polyline', {
  points: '16 16 14 18 16 20',
  key: '1jznyi'
}], ['line', {
  x1: '3',
  y1: '18',
  x2: '10',
  y2: '18',
  key: '16bh46'
}]]);
var WrapText$1 = WrapText;

var Wrench = createReactComponent('Wrench', [['path', {
  d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  key: 'cbrjhi'
}]]);
var Wrench$1 = Wrench;

var XCircle = createReactComponent('XCircle', [['circle', {
  cx: '12',
  cy: '12',
  r: '10',
  key: '1mglay'
}], ['line', {
  x1: '15',
  y1: '9',
  x2: '9',
  y2: '15',
  key: '19zs77'
}], ['line', {
  x1: '9',
  y1: '9',
  x2: '15',
  y2: '15',
  key: '10u9bu'
}]]);
var XCircle$1 = XCircle;

var XOctagon = createReactComponent('XOctagon', [['polygon', {
  points: '7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2',
  key: 'h1p8hx'
}], ['line', {
  x1: '15',
  y1: '9',
  x2: '9',
  y2: '15',
  key: '19zs77'
}], ['line', {
  x1: '9',
  y1: '9',
  x2: '15',
  y2: '15',
  key: '10u9bu'
}]]);
var XOctagon$1 = XOctagon;

var XSquare = createReactComponent('XSquare', [['rect', {
  x: '3',
  y: '3',
  width: '18',
  height: '18',
  rx: '2',
  ry: '2',
  key: 'maln0c'
}], ['line', {
  x1: '9',
  y1: '9',
  x2: '15',
  y2: '15',
  key: '10u9bu'
}], ['line', {
  x1: '15',
  y1: '9',
  x2: '9',
  y2: '15',
  key: '19zs77'
}]]);
var XSquare$1 = XSquare;

var X = createReactComponent('X', [['line', {
  x1: '18',
  y1: '6',
  x2: '6',
  y2: '18',
  key: '1o5bob'
}], ['line', {
  x1: '6',
  y1: '6',
  x2: '18',
  y2: '18',
  key: 'z4dcbv'
}]]);
var X$1 = X;

var Youtube = createReactComponent('Youtube', [['path', {
  d: 'M12 19c-2.3 0-6.4-.2-8.1-.6-.7-.2-1.2-.7-1.4-1.4-.3-1.1-.5-3.4-.5-5s.2-3.9.5-5c.2-.7.7-1.2 1.4-1.4C5.6 5.2 9.7 5 12 5s6.4.2 8.1.6c.7.2 1.2.7 1.4 1.4.3 1.1.5 3.4.5 5s-.2 3.9-.5 5c-.2.7-.7 1.2-1.4 1.4-1.7.4-5.8.6-8.1.6 0 0 0 0 0 0z',
  key: '1nqccg'
}], ['polygon', {
  points: '10 15 15 12 10 9',
  key: '1c7afu'
}]]);
var Youtube$1 = Youtube;

var ZapOff = createReactComponent('ZapOff', [['polyline', {
  points: '12.41 6.75 13 2 10.57 4.92',
  key: '122m05'
}], ['polyline', {
  points: '18.57 12.91 21 10 15.66 10',
  key: '16r43o'
}], ['polyline', {
  points: '8 8 3 14 12 14 11 22 16 16',
  key: 'tmh4bc'
}], ['line', {
  x1: '2',
  y1: '2',
  x2: '22',
  y2: '22',
  key: '1w4vcy'
}]]);
var ZapOff$1 = ZapOff;

var Zap = createReactComponent('Zap', [['polygon', {
  points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2',
  key: '45s27k'
}]]);
var Zap$1 = Zap;

var ZoomIn = createReactComponent('ZoomIn', [['circle', {
  cx: '11',
  cy: '11',
  r: '8',
  key: '4ej97u'
}], ['line', {
  x1: '21',
  y1: '21',
  x2: '16.65',
  y2: '16.65',
  key: '1p50m8'
}], ['line', {
  x1: '11',
  y1: '8',
  x2: '11',
  y2: '14',
  key: 'jw7mvq'
}], ['line', {
  x1: '8',
  y1: '11',
  x2: '14',
  y2: '11',
  key: '1nivud'
}]]);
var ZoomIn$1 = ZoomIn;

var ZoomOut = createReactComponent('ZoomOut', [['circle', {
  cx: '11',
  cy: '11',
  r: '8',
  key: '4ej97u'
}], ['line', {
  x1: '21',
  y1: '21',
  x2: '16.65',
  y2: '16.65',
  key: '1p50m8'
}], ['line', {
  x1: '8',
  y1: '11',
  x2: '14',
  y2: '11',
  key: '1nivud'
}]]);
var ZoomOut$1 = ZoomOut;

__webpack_unused_export__ = Accessibility$1;
__webpack_unused_export__ = Activity$1;
__webpack_unused_export__ = AirVent$1;
__webpack_unused_export__ = Airplay$1;
__webpack_unused_export__ = AlarmCheck$1;
__webpack_unused_export__ = AlarmClock$1;
__webpack_unused_export__ = AlarmClockOff$1;
__webpack_unused_export__ = AlarmMinus$1;
__webpack_unused_export__ = AlarmPlus$1;
__webpack_unused_export__ = Album$1;
__webpack_unused_export__ = AlertCircle$1;
__webpack_unused_export__ = AlertOctagon$1;
exports.uyG = AlertTriangle$1;
__webpack_unused_export__ = AlignCenter$1;
__webpack_unused_export__ = AlignCenterHorizontal$1;
__webpack_unused_export__ = AlignCenterVertical$1;
__webpack_unused_export__ = AlignEndHorizontal$1;
__webpack_unused_export__ = AlignEndVertical$1;
__webpack_unused_export__ = AlignHorizontalDistributeCenter$1;
__webpack_unused_export__ = AlignHorizontalDistributeEnd$1;
__webpack_unused_export__ = AlignHorizontalDistributeStart$1;
__webpack_unused_export__ = AlignHorizontalJustifyCenter$1;
__webpack_unused_export__ = AlignHorizontalJustifyEnd$1;
__webpack_unused_export__ = AlignHorizontalJustifyStart$1;
__webpack_unused_export__ = AlignHorizontalSpaceAround$1;
__webpack_unused_export__ = AlignHorizontalSpaceBetween$1;
__webpack_unused_export__ = AlignJustify$1;
__webpack_unused_export__ = AlignLeft$1;
__webpack_unused_export__ = AlignRight$1;
__webpack_unused_export__ = AlignStartHorizontal$1;
__webpack_unused_export__ = AlignStartVertical$1;
__webpack_unused_export__ = AlignVerticalDistributeCenter$1;
__webpack_unused_export__ = AlignVerticalDistributeEnd$1;
__webpack_unused_export__ = AlignVerticalDistributeStart$1;
__webpack_unused_export__ = AlignVerticalJustifyCenter$1;
__webpack_unused_export__ = AlignVerticalJustifyEnd$1;
__webpack_unused_export__ = AlignVerticalJustifyStart$1;
__webpack_unused_export__ = AlignVerticalSpaceAround$1;
__webpack_unused_export__ = AlignVerticalSpaceBetween$1;
__webpack_unused_export__ = Anchor$1;
__webpack_unused_export__ = Angry$1;
__webpack_unused_export__ = Annoyed$1;
__webpack_unused_export__ = Aperture$1;
__webpack_unused_export__ = Apple$1;
__webpack_unused_export__ = Archive$1;
__webpack_unused_export__ = ArchiveRestore$1;
__webpack_unused_export__ = Armchair$1;
__webpack_unused_export__ = ArrowBigDown$1;
__webpack_unused_export__ = ArrowBigLeft$1;
__webpack_unused_export__ = ArrowBigRight$1;
__webpack_unused_export__ = ArrowBigUp$1;
__webpack_unused_export__ = ArrowDown$1;
__webpack_unused_export__ = ArrowDownCircle$1;
__webpack_unused_export__ = ArrowDownLeft$1;
__webpack_unused_export__ = ArrowDownRight$1;
__webpack_unused_export__ = ArrowLeft$1;
__webpack_unused_export__ = ArrowLeftCircle$1;
__webpack_unused_export__ = ArrowLeftRight$1;
exports.olP = ArrowRight$1;
__webpack_unused_export__ = ArrowRightCircle$1;
__webpack_unused_export__ = ArrowUp$1;
__webpack_unused_export__ = ArrowUpCircle$1;
__webpack_unused_export__ = ArrowUpDown$1;
__webpack_unused_export__ = ArrowUpLeft$1;
__webpack_unused_export__ = ArrowUpRight$1;
__webpack_unused_export__ = Asterisk$1;
__webpack_unused_export__ = AtSign$1;
__webpack_unused_export__ = Award$1;
__webpack_unused_export__ = Axe$1;
__webpack_unused_export__ = Axis3d$1;
__webpack_unused_export__ = Baby$1;
__webpack_unused_export__ = Backpack$1;
__webpack_unused_export__ = BaggageClaim$1;
__webpack_unused_export__ = Banana$1;
__webpack_unused_export__ = Banknote$1;
__webpack_unused_export__ = BarChart$1;
__webpack_unused_export__ = BarChart2$1;
__webpack_unused_export__ = BarChart3$1;
__webpack_unused_export__ = BarChart4$1;
__webpack_unused_export__ = BarChartHorizontal$1;
__webpack_unused_export__ = Baseline$1;
__webpack_unused_export__ = Bath$1;
__webpack_unused_export__ = Battery$1;
__webpack_unused_export__ = BatteryCharging$1;
__webpack_unused_export__ = BatteryFull$1;
__webpack_unused_export__ = BatteryLow$1;
__webpack_unused_export__ = BatteryMedium$1;
__webpack_unused_export__ = Beaker$1;
__webpack_unused_export__ = Bed$1;
__webpack_unused_export__ = BedDouble$1;
__webpack_unused_export__ = BedSingle$1;
__webpack_unused_export__ = Beer$1;
__webpack_unused_export__ = Bell$1;
__webpack_unused_export__ = BellMinus$1;
__webpack_unused_export__ = BellOff$1;
__webpack_unused_export__ = BellPlus$1;
__webpack_unused_export__ = BellRing$1;
__webpack_unused_export__ = Bike$1;
__webpack_unused_export__ = Binary$1;
__webpack_unused_export__ = Bitcoin$1;
__webpack_unused_export__ = Bluetooth$1;
__webpack_unused_export__ = BluetoothConnected$1;
__webpack_unused_export__ = BluetoothOff$1;
__webpack_unused_export__ = BluetoothSearching$1;
__webpack_unused_export__ = Bold$1;
__webpack_unused_export__ = Bomb$1;
__webpack_unused_export__ = Bone$1;
__webpack_unused_export__ = Book$1;
__webpack_unused_export__ = BookOpen$1;
__webpack_unused_export__ = BookOpenCheck$1;
__webpack_unused_export__ = Bookmark$1;
__webpack_unused_export__ = BookmarkMinus$1;
__webpack_unused_export__ = BookmarkPlus$1;
__webpack_unused_export__ = Bot$1;
__webpack_unused_export__ = Box$1;
__webpack_unused_export__ = BoxSelect$1;
__webpack_unused_export__ = Boxes$1;
__webpack_unused_export__ = Briefcase$1;
__webpack_unused_export__ = Brush$1;
__webpack_unused_export__ = Bug$1;
__webpack_unused_export__ = Building$1;
__webpack_unused_export__ = Building2$1;
__webpack_unused_export__ = Bus$1;
__webpack_unused_export__ = Cake$1;
__webpack_unused_export__ = Calculator$1;
__webpack_unused_export__ = Calendar$1;
__webpack_unused_export__ = CalendarCheck$1;
__webpack_unused_export__ = CalendarCheck2$1;
__webpack_unused_export__ = CalendarClock$1;
__webpack_unused_export__ = CalendarDays$1;
__webpack_unused_export__ = CalendarHeart$1;
__webpack_unused_export__ = CalendarMinus$1;
__webpack_unused_export__ = CalendarOff$1;
__webpack_unused_export__ = CalendarPlus$1;
__webpack_unused_export__ = CalendarRange$1;
__webpack_unused_export__ = CalendarSearch$1;
__webpack_unused_export__ = CalendarX$1;
__webpack_unused_export__ = CalendarX2$1;
__webpack_unused_export__ = Camera$1;
__webpack_unused_export__ = CameraOff$1;
__webpack_unused_export__ = Car$1;
__webpack_unused_export__ = Carrot$1;
__webpack_unused_export__ = Cast$1;
exports.JrY = Check$1;
__webpack_unused_export__ = CheckCircle$1;
__webpack_unused_export__ = CheckCircle2$1;
__webpack_unused_export__ = CheckSquare$1;
__webpack_unused_export__ = ChefHat$1;
__webpack_unused_export__ = Cherry$1;
__webpack_unused_export__ = ChevronDown$1;
__webpack_unused_export__ = ChevronFirst$1;
__webpack_unused_export__ = ChevronLast$1;
exports.s$$ = ChevronLeft$1;
exports._Qn = ChevronRight$1;
__webpack_unused_export__ = ChevronUp$1;
__webpack_unused_export__ = ChevronsDown$1;
__webpack_unused_export__ = ChevronsDownUp$1;
__webpack_unused_export__ = ChevronsLeft$1;
__webpack_unused_export__ = ChevronsLeftRight$1;
__webpack_unused_export__ = ChevronsRight$1;
__webpack_unused_export__ = ChevronsRightLeft$1;
__webpack_unused_export__ = ChevronsUp$1;
__webpack_unused_export__ = ChevronsUpDown$1;
__webpack_unused_export__ = Chrome$1;
__webpack_unused_export__ = Cigarette$1;
__webpack_unused_export__ = CigaretteOff$1;
exports.Cdc = Circle$1;
__webpack_unused_export__ = CircleDot$1;
__webpack_unused_export__ = CircleEllipsis$1;
__webpack_unused_export__ = CircleSlashed$1;
__webpack_unused_export__ = Citrus$1;
__webpack_unused_export__ = Clapperboard$1;
__webpack_unused_export__ = Clipboard$1;
__webpack_unused_export__ = ClipboardCheck$1;
__webpack_unused_export__ = ClipboardCopy$1;
__webpack_unused_export__ = ClipboardEdit$1;
__webpack_unused_export__ = ClipboardList$1;
__webpack_unused_export__ = ClipboardSignature$1;
__webpack_unused_export__ = ClipboardType$1;
__webpack_unused_export__ = ClipboardX$1;
__webpack_unused_export__ = Clock$1;
__webpack_unused_export__ = Clock1$1;
__webpack_unused_export__ = Clock10$1;
__webpack_unused_export__ = Clock11$1;
__webpack_unused_export__ = Clock12$1;
__webpack_unused_export__ = Clock2$1;
__webpack_unused_export__ = Clock3$1;
__webpack_unused_export__ = Clock4$1;
__webpack_unused_export__ = Clock5$1;
__webpack_unused_export__ = Clock6$1;
__webpack_unused_export__ = Clock7$1;
__webpack_unused_export__ = Clock8$1;
__webpack_unused_export__ = Clock9$1;
__webpack_unused_export__ = Cloud$1;
__webpack_unused_export__ = CloudCog$1;
__webpack_unused_export__ = CloudDrizzle$1;
__webpack_unused_export__ = CloudFog$1;
__webpack_unused_export__ = CloudHail$1;
__webpack_unused_export__ = CloudLightning$1;
__webpack_unused_export__ = CloudMoon$1;
__webpack_unused_export__ = CloudMoonRain$1;
__webpack_unused_export__ = CloudOff$1;
__webpack_unused_export__ = CloudRain$1;
__webpack_unused_export__ = CloudRainWind$1;
__webpack_unused_export__ = CloudSnow$1;
__webpack_unused_export__ = CloudSun$1;
__webpack_unused_export__ = CloudSunRain$1;
__webpack_unused_export__ = Cloudy$1;
__webpack_unused_export__ = Clover$1;
__webpack_unused_export__ = Code$1;
__webpack_unused_export__ = Code2$1;
__webpack_unused_export__ = Codepen$1;
__webpack_unused_export__ = Codesandbox$1;
__webpack_unused_export__ = Coffee$1;
__webpack_unused_export__ = Cog$1;
__webpack_unused_export__ = Coins$1;
__webpack_unused_export__ = Columns$1;
exports.mYg = Command$1;
__webpack_unused_export__ = Compass$1;
__webpack_unused_export__ = Component$1;
__webpack_unused_export__ = ConciergeBell$1;
__webpack_unused_export__ = Contact$1;
__webpack_unused_export__ = Contrast$1;
__webpack_unused_export__ = Cookie$1;
__webpack_unused_export__ = Copy$1;
__webpack_unused_export__ = Copyleft$1;
__webpack_unused_export__ = Copyright$1;
__webpack_unused_export__ = CornerDownLeft$1;
__webpack_unused_export__ = CornerDownRight$1;
__webpack_unused_export__ = CornerLeftDown$1;
__webpack_unused_export__ = CornerLeftUp$1;
__webpack_unused_export__ = CornerRightDown$1;
__webpack_unused_export__ = CornerRightUp$1;
__webpack_unused_export__ = CornerUpLeft$1;
__webpack_unused_export__ = CornerUpRight$1;
__webpack_unused_export__ = Cpu$1;
exports.aBT = CreditCard$1;
__webpack_unused_export__ = Croissant$1;
__webpack_unused_export__ = Crop$1;
__webpack_unused_export__ = Cross$1;
__webpack_unused_export__ = Crosshair$1;
__webpack_unused_export__ = Crown$1;
__webpack_unused_export__ = CupSoda$1;
__webpack_unused_export__ = CurlyBraces$1;
__webpack_unused_export__ = Currency$1;
__webpack_unused_export__ = Database$1;
__webpack_unused_export__ = Delete$1;
__webpack_unused_export__ = Diamond$1;
__webpack_unused_export__ = Dice1$1;
__webpack_unused_export__ = Dice2$1;
__webpack_unused_export__ = Dice3$1;
__webpack_unused_export__ = Dice4$1;
__webpack_unused_export__ = Dice5$1;
__webpack_unused_export__ = Dice6$1;
__webpack_unused_export__ = Dices$1;
__webpack_unused_export__ = Diff$1;
__webpack_unused_export__ = Disc$1;
__webpack_unused_export__ = Divide$1;
__webpack_unused_export__ = DivideCircle$1;
__webpack_unused_export__ = DivideSquare$1;
__webpack_unused_export__ = DollarSign$1;
__webpack_unused_export__ = Download$1;
__webpack_unused_export__ = DownloadCloud$1;
__webpack_unused_export__ = Dribbble$1;
__webpack_unused_export__ = Droplet$1;
__webpack_unused_export__ = Droplets$1;
__webpack_unused_export__ = Drumstick$1;
__webpack_unused_export__ = Ear$1;
__webpack_unused_export__ = EarOff$1;
__webpack_unused_export__ = Edit$1;
__webpack_unused_export__ = Edit2$1;
__webpack_unused_export__ = Edit3$1;
__webpack_unused_export__ = Egg$1;
__webpack_unused_export__ = EggFried$1;
__webpack_unused_export__ = Equal$1;
__webpack_unused_export__ = EqualNot$1;
__webpack_unused_export__ = Eraser$1;
__webpack_unused_export__ = Euro$1;
__webpack_unused_export__ = Expand$1;
__webpack_unused_export__ = ExternalLink$1;
__webpack_unused_export__ = Eye$1;
__webpack_unused_export__ = EyeOff$1;
__webpack_unused_export__ = Facebook$1;
__webpack_unused_export__ = Factory$1;
__webpack_unused_export__ = Fan$1;
__webpack_unused_export__ = FastForward$1;
__webpack_unused_export__ = Feather$1;
__webpack_unused_export__ = Figma$1;
exports.$BE = File$1;
__webpack_unused_export__ = FileArchive$1;
__webpack_unused_export__ = FileAudio$1;
__webpack_unused_export__ = FileAudio2$1;
__webpack_unused_export__ = FileAxis3d$1;
__webpack_unused_export__ = FileBadge$1;
__webpack_unused_export__ = FileBadge2$1;
__webpack_unused_export__ = FileBarChart$1;
__webpack_unused_export__ = FileBarChart2$1;
__webpack_unused_export__ = FileBox$1;
__webpack_unused_export__ = FileCheck$1;
__webpack_unused_export__ = FileCheck2$1;
__webpack_unused_export__ = FileClock$1;
__webpack_unused_export__ = FileCode$1;
__webpack_unused_export__ = FileCog$1;
__webpack_unused_export__ = FileCog2$1;
__webpack_unused_export__ = FileDiff$1;
__webpack_unused_export__ = FileDigit$1;
__webpack_unused_export__ = FileDown$1;
__webpack_unused_export__ = FileEdit$1;
__webpack_unused_export__ = FileHeart$1;
__webpack_unused_export__ = FileImage$1;
__webpack_unused_export__ = FileInput$1;
__webpack_unused_export__ = FileJson$1;
__webpack_unused_export__ = FileJson2$1;
__webpack_unused_export__ = FileKey$1;
__webpack_unused_export__ = FileKey2$1;
__webpack_unused_export__ = FileLineChart$1;
__webpack_unused_export__ = FileLock$1;
__webpack_unused_export__ = FileLock2$1;
__webpack_unused_export__ = FileMinus$1;
__webpack_unused_export__ = FileMinus2$1;
__webpack_unused_export__ = FileOutput$1;
__webpack_unused_export__ = FilePieChart$1;
__webpack_unused_export__ = FilePlus$1;
__webpack_unused_export__ = FilePlus2$1;
__webpack_unused_export__ = FileQuestion$1;
__webpack_unused_export__ = FileScan$1;
__webpack_unused_export__ = FileSearch$1;
__webpack_unused_export__ = FileSearch2$1;
__webpack_unused_export__ = FileSignature$1;
__webpack_unused_export__ = FileSpreadsheet$1;
__webpack_unused_export__ = FileSymlink$1;
__webpack_unused_export__ = FileTerminal$1;
exports.acj = FileText$1;
__webpack_unused_export__ = FileType$1;
__webpack_unused_export__ = FileType2$1;
__webpack_unused_export__ = FileUp$1;
__webpack_unused_export__ = FileVideo$1;
__webpack_unused_export__ = FileVideo2$1;
__webpack_unused_export__ = FileVolume$1;
__webpack_unused_export__ = FileVolume2$1;
__webpack_unused_export__ = FileWarning$1;
__webpack_unused_export__ = FileX$1;
__webpack_unused_export__ = FileX2$1;
__webpack_unused_export__ = Files$1;
__webpack_unused_export__ = Film$1;
__webpack_unused_export__ = Filter$1;
__webpack_unused_export__ = Fingerprint$1;
__webpack_unused_export__ = Flag$1;
__webpack_unused_export__ = FlagOff$1;
__webpack_unused_export__ = FlagTriangleLeft$1;
__webpack_unused_export__ = FlagTriangleRight$1;
__webpack_unused_export__ = Flame$1;
__webpack_unused_export__ = Flashlight$1;
__webpack_unused_export__ = FlashlightOff$1;
__webpack_unused_export__ = FlaskConical$1;
__webpack_unused_export__ = FlaskRound$1;
__webpack_unused_export__ = FlipHorizontal$1;
__webpack_unused_export__ = FlipHorizontal2$1;
__webpack_unused_export__ = FlipVertical$1;
__webpack_unused_export__ = FlipVertical2$1;
__webpack_unused_export__ = Flower$1;
__webpack_unused_export__ = Flower2$1;
__webpack_unused_export__ = Focus$1;
__webpack_unused_export__ = Folder$1;
__webpack_unused_export__ = FolderArchive$1;
__webpack_unused_export__ = FolderCheck$1;
__webpack_unused_export__ = FolderClock$1;
__webpack_unused_export__ = FolderClosed$1;
__webpack_unused_export__ = FolderCog$1;
__webpack_unused_export__ = FolderCog2$1;
__webpack_unused_export__ = FolderDown$1;
__webpack_unused_export__ = FolderEdit$1;
__webpack_unused_export__ = FolderHeart$1;
__webpack_unused_export__ = FolderInput$1;
__webpack_unused_export__ = FolderKey$1;
__webpack_unused_export__ = FolderLock$1;
__webpack_unused_export__ = FolderMinus$1;
__webpack_unused_export__ = FolderOpen$1;
__webpack_unused_export__ = FolderOutput$1;
__webpack_unused_export__ = FolderPlus$1;
__webpack_unused_export__ = FolderSearch$1;
__webpack_unused_export__ = FolderSearch2$1;
__webpack_unused_export__ = FolderSymlink$1;
__webpack_unused_export__ = FolderTree$1;
__webpack_unused_export__ = FolderUp$1;
__webpack_unused_export__ = FolderX$1;
__webpack_unused_export__ = Folders$1;
__webpack_unused_export__ = FormInput$1;
__webpack_unused_export__ = Forward$1;
__webpack_unused_export__ = Frame$1;
__webpack_unused_export__ = Framer$1;
__webpack_unused_export__ = Frown$1;
__webpack_unused_export__ = Fuel$1;
__webpack_unused_export__ = FunctionSquare$1;
__webpack_unused_export__ = Gamepad$1;
__webpack_unused_export__ = Gamepad2$1;
__webpack_unused_export__ = Gauge$1;
__webpack_unused_export__ = Gavel$1;
__webpack_unused_export__ = Gem$1;
__webpack_unused_export__ = Ghost$1;
__webpack_unused_export__ = Gift$1;
__webpack_unused_export__ = GitBranch$1;
__webpack_unused_export__ = GitBranchPlus$1;
__webpack_unused_export__ = GitCommit$1;
__webpack_unused_export__ = GitCompare$1;
__webpack_unused_export__ = GitFork$1;
__webpack_unused_export__ = GitMerge$1;
__webpack_unused_export__ = GitPullRequest$1;
__webpack_unused_export__ = GitPullRequestClosed$1;
__webpack_unused_export__ = GitPullRequestDraft$1;
__webpack_unused_export__ = Github$1;
__webpack_unused_export__ = Gitlab$1;
__webpack_unused_export__ = GlassWater$1;
__webpack_unused_export__ = Glasses$1;
__webpack_unused_export__ = Globe$1;
__webpack_unused_export__ = Globe2$1;
__webpack_unused_export__ = Grab$1;
__webpack_unused_export__ = GraduationCap$1;
__webpack_unused_export__ = Grape$1;
__webpack_unused_export__ = Grid$1;
__webpack_unused_export__ = GripHorizontal$1;
__webpack_unused_export__ = GripVertical$1;
__webpack_unused_export__ = Hammer$1;
__webpack_unused_export__ = Hand$1;
__webpack_unused_export__ = HandMetal$1;
__webpack_unused_export__ = HardDrive$1;
__webpack_unused_export__ = HardHat$1;
__webpack_unused_export__ = Hash$1;
__webpack_unused_export__ = Haze$1;
__webpack_unused_export__ = Headphones$1;
__webpack_unused_export__ = Heart$1;
__webpack_unused_export__ = HeartCrack$1;
__webpack_unused_export__ = HeartHandshake$1;
__webpack_unused_export__ = HeartOff$1;
__webpack_unused_export__ = HeartPulse$1;
exports.j$F = HelpCircle$1;
__webpack_unused_export__ = Hexagon$1;
__webpack_unused_export__ = Highlighter$1;
__webpack_unused_export__ = History$1;
__webpack_unused_export__ = Home$1;
__webpack_unused_export__ = Hourglass$1;
__webpack_unused_export__ = IceCream$1;
exports.Eep = Image$1;
__webpack_unused_export__ = ImageMinus$1;
__webpack_unused_export__ = ImageOff$1;
__webpack_unused_export__ = ImagePlus$1;
__webpack_unused_export__ = Import$1;
__webpack_unused_export__ = Inbox$1;
__webpack_unused_export__ = Indent$1;
__webpack_unused_export__ = IndianRupee$1;
__webpack_unused_export__ = Infinity$1;
__webpack_unused_export__ = Info$1;
__webpack_unused_export__ = Inspect$1;
__webpack_unused_export__ = Instagram$1;
__webpack_unused_export__ = Italic$1;
__webpack_unused_export__ = JapaneseYen$1;
__webpack_unused_export__ = Joystick$1;
__webpack_unused_export__ = Key$1;
__webpack_unused_export__ = Keyboard$1;
__webpack_unused_export__ = Lamp$1;
__webpack_unused_export__ = LampCeiling$1;
__webpack_unused_export__ = LampDesk$1;
__webpack_unused_export__ = LampFloor$1;
__webpack_unused_export__ = LampWallDown$1;
__webpack_unused_export__ = LampWallUp$1;
__webpack_unused_export__ = Landmark$1;
__webpack_unused_export__ = Languages$1;
exports.Izo = Laptop$1;
__webpack_unused_export__ = Laptop2$1;
__webpack_unused_export__ = Lasso$1;
__webpack_unused_export__ = LassoSelect$1;
__webpack_unused_export__ = Laugh$1;
__webpack_unused_export__ = Layers$1;
__webpack_unused_export__ = Layout$1;
__webpack_unused_export__ = LayoutDashboard$1;
__webpack_unused_export__ = LayoutGrid$1;
__webpack_unused_export__ = LayoutList$1;
__webpack_unused_export__ = LayoutTemplate$1;
__webpack_unused_export__ = Leaf$1;
__webpack_unused_export__ = Library$1;
__webpack_unused_export__ = LifeBuoy$1;
__webpack_unused_export__ = Lightbulb$1;
__webpack_unused_export__ = LightbulbOff$1;
__webpack_unused_export__ = LineChart$1;
__webpack_unused_export__ = Link$1;
__webpack_unused_export__ = Link2$1;
__webpack_unused_export__ = Link2Off$1;
__webpack_unused_export__ = Linkedin$1;
__webpack_unused_export__ = List$1;
__webpack_unused_export__ = ListChecks$1;
__webpack_unused_export__ = ListEnd$1;
__webpack_unused_export__ = ListMinus$1;
__webpack_unused_export__ = ListMusic$1;
__webpack_unused_export__ = ListOrdered$1;
__webpack_unused_export__ = ListPlus$1;
__webpack_unused_export__ = ListStart$1;
__webpack_unused_export__ = ListVideo$1;
__webpack_unused_export__ = ListX$1;
__webpack_unused_export__ = Loader$1;
exports.zM5 = Loader2$1;
__webpack_unused_export__ = Locate$1;
__webpack_unused_export__ = LocateFixed$1;
__webpack_unused_export__ = LocateOff$1;
__webpack_unused_export__ = Lock$1;
__webpack_unused_export__ = LogIn$1;
__webpack_unused_export__ = LogOut$1;
__webpack_unused_export__ = Luggage$1;
__webpack_unused_export__ = Magnet$1;
__webpack_unused_export__ = Mail$1;
__webpack_unused_export__ = MailCheck$1;
__webpack_unused_export__ = MailMinus$1;
__webpack_unused_export__ = MailOpen$1;
__webpack_unused_export__ = MailPlus$1;
__webpack_unused_export__ = MailQuestion$1;
__webpack_unused_export__ = MailSearch$1;
__webpack_unused_export__ = MailWarning$1;
__webpack_unused_export__ = MailX$1;
__webpack_unused_export__ = Mails$1;
__webpack_unused_export__ = Map$1;
__webpack_unused_export__ = MapPin$1;
__webpack_unused_export__ = MapPinOff$1;
__webpack_unused_export__ = Martini$1;
__webpack_unused_export__ = Maximize$1;
__webpack_unused_export__ = Maximize2$1;
__webpack_unused_export__ = Medal$1;
__webpack_unused_export__ = Megaphone$1;
__webpack_unused_export__ = MegaphoneOff$1;
__webpack_unused_export__ = Meh$1;
__webpack_unused_export__ = Menu$1;
__webpack_unused_export__ = MessageCircle$1;
__webpack_unused_export__ = MessageSquare$1;
__webpack_unused_export__ = Mic$1;
__webpack_unused_export__ = Mic2$1;
__webpack_unused_export__ = MicOff$1;
__webpack_unused_export__ = Microscope$1;
__webpack_unused_export__ = Microwave$1;
__webpack_unused_export__ = Milestone$1;
__webpack_unused_export__ = Minimize$1;
__webpack_unused_export__ = Minimize2$1;
__webpack_unused_export__ = Minus$1;
__webpack_unused_export__ = MinusCircle$1;
__webpack_unused_export__ = MinusSquare$1;
__webpack_unused_export__ = Monitor$1;
__webpack_unused_export__ = MonitorOff$1;
__webpack_unused_export__ = MonitorSpeaker$1;
exports.JFe = Moon$1;
__webpack_unused_export__ = MoreHorizontal$1;
exports.hlC = MoreVertical$1;
__webpack_unused_export__ = Mountain$1;
__webpack_unused_export__ = MountainSnow$1;
__webpack_unused_export__ = Mouse$1;
__webpack_unused_export__ = MousePointer$1;
__webpack_unused_export__ = MousePointer2$1;
__webpack_unused_export__ = MousePointerClick$1;
__webpack_unused_export__ = Move$1;
__webpack_unused_export__ = Move3d$1;
__webpack_unused_export__ = MoveDiagonal$1;
__webpack_unused_export__ = MoveDiagonal2$1;
__webpack_unused_export__ = MoveHorizontal$1;
__webpack_unused_export__ = MoveVertical$1;
__webpack_unused_export__ = Music$1;
__webpack_unused_export__ = Music2$1;
__webpack_unused_export__ = Music3$1;
__webpack_unused_export__ = Music4$1;
__webpack_unused_export__ = Navigation$1;
__webpack_unused_export__ = Navigation2$1;
__webpack_unused_export__ = Navigation2Off$1;
__webpack_unused_export__ = NavigationOff$1;
__webpack_unused_export__ = Network$1;
__webpack_unused_export__ = Newspaper$1;
__webpack_unused_export__ = Octagon$1;
__webpack_unused_export__ = Option$1;
__webpack_unused_export__ = Outdent$1;
__webpack_unused_export__ = Package$1;
__webpack_unused_export__ = Package2$1;
__webpack_unused_export__ = PackageCheck$1;
__webpack_unused_export__ = PackageMinus$1;
__webpack_unused_export__ = PackageOpen$1;
__webpack_unused_export__ = PackagePlus$1;
__webpack_unused_export__ = PackageSearch$1;
__webpack_unused_export__ = PackageX$1;
__webpack_unused_export__ = PaintBucket$1;
__webpack_unused_export__ = Paintbrush$1;
__webpack_unused_export__ = Paintbrush2$1;
__webpack_unused_export__ = Palette$1;
__webpack_unused_export__ = Palmtree$1;
__webpack_unused_export__ = Paperclip$1;
__webpack_unused_export__ = PartyPopper$1;
__webpack_unused_export__ = Pause$1;
__webpack_unused_export__ = PauseCircle$1;
__webpack_unused_export__ = PauseOctagon$1;
__webpack_unused_export__ = PenTool$1;
__webpack_unused_export__ = Pencil$1;
__webpack_unused_export__ = Percent$1;
__webpack_unused_export__ = PersonStanding$1;
__webpack_unused_export__ = Phone$1;
__webpack_unused_export__ = PhoneCall$1;
__webpack_unused_export__ = PhoneForwarded$1;
__webpack_unused_export__ = PhoneIncoming$1;
__webpack_unused_export__ = PhoneMissed$1;
__webpack_unused_export__ = PhoneOff$1;
__webpack_unused_export__ = PhoneOutgoing$1;
__webpack_unused_export__ = PieChart$1;
__webpack_unused_export__ = PiggyBank$1;
__webpack_unused_export__ = Pin$1;
__webpack_unused_export__ = PinOff$1;
__webpack_unused_export__ = Pipette$1;
exports.k4s = Pizza$1;
__webpack_unused_export__ = Plane$1;
__webpack_unused_export__ = Play$1;
__webpack_unused_export__ = PlayCircle$1;
__webpack_unused_export__ = Plug$1;
__webpack_unused_export__ = Plug2$1;
__webpack_unused_export__ = PlugZap$1;
exports.v37 = Plus$1;
__webpack_unused_export__ = PlusCircle$1;
__webpack_unused_export__ = PlusSquare$1;
__webpack_unused_export__ = Pocket$1;
__webpack_unused_export__ = Podcast$1;
__webpack_unused_export__ = Pointer$1;
__webpack_unused_export__ = PoundSterling$1;
__webpack_unused_export__ = Power$1;
__webpack_unused_export__ = PowerOff$1;
__webpack_unused_export__ = Printer$1;
__webpack_unused_export__ = Puzzle$1;
__webpack_unused_export__ = QrCode$1;
__webpack_unused_export__ = Quote$1;
__webpack_unused_export__ = Radio$1;
__webpack_unused_export__ = RadioReceiver$1;
__webpack_unused_export__ = RectangleHorizontal$1;
__webpack_unused_export__ = RectangleVertical$1;
__webpack_unused_export__ = Recycle$1;
__webpack_unused_export__ = Redo$1;
__webpack_unused_export__ = Redo2$1;
__webpack_unused_export__ = RefreshCcw$1;
__webpack_unused_export__ = RefreshCw$1;
__webpack_unused_export__ = Refrigerator$1;
__webpack_unused_export__ = Regex$1;
__webpack_unused_export__ = Repeat$1;
__webpack_unused_export__ = Repeat1$1;
__webpack_unused_export__ = Reply$1;
__webpack_unused_export__ = ReplyAll$1;
__webpack_unused_export__ = Rewind$1;
__webpack_unused_export__ = Rocket$1;
__webpack_unused_export__ = RockingChair$1;
__webpack_unused_export__ = Rotate3d$1;
__webpack_unused_export__ = RotateCcw$1;
__webpack_unused_export__ = RotateCw$1;
__webpack_unused_export__ = Rss$1;
__webpack_unused_export__ = Ruler$1;
__webpack_unused_export__ = RussianRuble$1;
__webpack_unused_export__ = Sailboat$1;
__webpack_unused_export__ = Save$1;
__webpack_unused_export__ = Scale$1;
__webpack_unused_export__ = Scale3d$1;
__webpack_unused_export__ = Scaling$1;
__webpack_unused_export__ = Scan$1;
__webpack_unused_export__ = ScanFace$1;
__webpack_unused_export__ = ScanLine$1;
__webpack_unused_export__ = Scissors$1;
__webpack_unused_export__ = ScreenShare$1;
__webpack_unused_export__ = ScreenShareOff$1;
__webpack_unused_export__ = Scroll$1;
__webpack_unused_export__ = Search$1;
__webpack_unused_export__ = Send$1;
__webpack_unused_export__ = SeparatorHorizontal$1;
__webpack_unused_export__ = SeparatorVertical$1;
__webpack_unused_export__ = Server$1;
__webpack_unused_export__ = ServerCog$1;
__webpack_unused_export__ = ServerCrash$1;
__webpack_unused_export__ = ServerOff$1;
exports.Zrf = Settings$1;
__webpack_unused_export__ = Settings2$1;
__webpack_unused_export__ = Share$1;
__webpack_unused_export__ = Share2$1;
__webpack_unused_export__ = Sheet$1;
__webpack_unused_export__ = Shield$1;
__webpack_unused_export__ = ShieldAlert$1;
__webpack_unused_export__ = ShieldCheck$1;
__webpack_unused_export__ = ShieldClose$1;
__webpack_unused_export__ = ShieldOff$1;
__webpack_unused_export__ = Shirt$1;
__webpack_unused_export__ = ShoppingBag$1;
__webpack_unused_export__ = ShoppingCart$1;
__webpack_unused_export__ = Shovel$1;
__webpack_unused_export__ = ShowerHead$1;
__webpack_unused_export__ = Shrink$1;
__webpack_unused_export__ = Shrub$1;
__webpack_unused_export__ = Shuffle$1;
__webpack_unused_export__ = Sidebar$1;
__webpack_unused_export__ = SidebarClose$1;
__webpack_unused_export__ = SidebarOpen$1;
__webpack_unused_export__ = Sigma$1;
__webpack_unused_export__ = Signal$1;
__webpack_unused_export__ = SignalHigh$1;
__webpack_unused_export__ = SignalLow$1;
__webpack_unused_export__ = SignalMedium$1;
__webpack_unused_export__ = SignalZero$1;
__webpack_unused_export__ = Siren$1;
__webpack_unused_export__ = SkipBack$1;
__webpack_unused_export__ = SkipForward$1;
__webpack_unused_export__ = Skull$1;
__webpack_unused_export__ = Slack$1;
__webpack_unused_export__ = Slash$1;
__webpack_unused_export__ = Slice$1;
__webpack_unused_export__ = Sliders$1;
__webpack_unused_export__ = SlidersHorizontal$1;
__webpack_unused_export__ = Smartphone$1;
__webpack_unused_export__ = SmartphoneCharging$1;
__webpack_unused_export__ = Smile$1;
__webpack_unused_export__ = SmilePlus$1;
__webpack_unused_export__ = Snowflake$1;
__webpack_unused_export__ = Sofa$1;
__webpack_unused_export__ = SortAsc$1;
__webpack_unused_export__ = SortDesc$1;
__webpack_unused_export__ = Speaker$1;
__webpack_unused_export__ = Sprout$1;
__webpack_unused_export__ = Square$1;
__webpack_unused_export__ = Star$1;
__webpack_unused_export__ = StarHalf$1;
__webpack_unused_export__ = StarOff$1;
__webpack_unused_export__ = Stethoscope$1;
__webpack_unused_export__ = Sticker$1;
__webpack_unused_export__ = StickyNote$1;
__webpack_unused_export__ = StopCircle$1;
__webpack_unused_export__ = StretchHorizontal$1;
__webpack_unused_export__ = StretchVertical$1;
__webpack_unused_export__ = Strikethrough$1;
__webpack_unused_export__ = Subscript$1;
__webpack_unused_export__ = Sun$1;
__webpack_unused_export__ = SunDim$1;
exports.j1h = SunMedium$1;
__webpack_unused_export__ = SunMoon$1;
__webpack_unused_export__ = SunSnow$1;
__webpack_unused_export__ = Sunrise$1;
__webpack_unused_export__ = Sunset$1;
__webpack_unused_export__ = Superscript$1;
__webpack_unused_export__ = SwissFranc$1;
__webpack_unused_export__ = SwitchCamera$1;
__webpack_unused_export__ = Sword$1;
__webpack_unused_export__ = Swords$1;
__webpack_unused_export__ = Syringe$1;
__webpack_unused_export__ = Table$1;
__webpack_unused_export__ = Table2$1;
__webpack_unused_export__ = Tablet$1;
__webpack_unused_export__ = Tag$1;
__webpack_unused_export__ = Tags$1;
__webpack_unused_export__ = Target$1;
__webpack_unused_export__ = Tent$1;
__webpack_unused_export__ = Terminal$1;
__webpack_unused_export__ = TerminalSquare$1;
__webpack_unused_export__ = TextCursor$1;
__webpack_unused_export__ = TextCursorInput$1;
__webpack_unused_export__ = Thermometer$1;
__webpack_unused_export__ = ThermometerSnowflake$1;
__webpack_unused_export__ = ThermometerSun$1;
__webpack_unused_export__ = ThumbsDown$1;
__webpack_unused_export__ = ThumbsUp$1;
__webpack_unused_export__ = Ticket$1;
__webpack_unused_export__ = Timer$1;
__webpack_unused_export__ = TimerOff$1;
__webpack_unused_export__ = TimerReset$1;
__webpack_unused_export__ = ToggleLeft$1;
__webpack_unused_export__ = ToggleRight$1;
__webpack_unused_export__ = Tornado$1;
__webpack_unused_export__ = ToyBrick$1;
__webpack_unused_export__ = Train$1;
exports.rFk = Trash$1;
__webpack_unused_export__ = Trash2$1;
__webpack_unused_export__ = TreeDeciduous$1;
__webpack_unused_export__ = TreePine$1;
__webpack_unused_export__ = Trees$1;
__webpack_unused_export__ = Trello$1;
__webpack_unused_export__ = TrendingDown$1;
__webpack_unused_export__ = TrendingUp$1;
__webpack_unused_export__ = Triangle$1;
__webpack_unused_export__ = Trophy$1;
__webpack_unused_export__ = Truck$1;
__webpack_unused_export__ = Tv$1;
__webpack_unused_export__ = Tv2$1;
__webpack_unused_export__ = Twitch$1;
exports.tLe = Twitter$1;
__webpack_unused_export__ = Type$1;
__webpack_unused_export__ = Umbrella$1;
__webpack_unused_export__ = Underline$1;
__webpack_unused_export__ = Undo$1;
__webpack_unused_export__ = Undo2$1;
__webpack_unused_export__ = Unlink$1;
__webpack_unused_export__ = Unlink2$1;
__webpack_unused_export__ = Unlock$1;
__webpack_unused_export__ = Upload$1;
__webpack_unused_export__ = UploadCloud$1;
__webpack_unused_export__ = Usb$1;
exports.n5m = User$1;
__webpack_unused_export__ = UserCheck$1;
__webpack_unused_export__ = UserCog$1;
__webpack_unused_export__ = UserMinus$1;
__webpack_unused_export__ = UserPlus$1;
__webpack_unused_export__ = UserX$1;
__webpack_unused_export__ = Users$1;
__webpack_unused_export__ = Utensils$1;
__webpack_unused_export__ = UtensilsCrossed$1;
__webpack_unused_export__ = VenetianMask$1;
__webpack_unused_export__ = Verified$1;
__webpack_unused_export__ = Vibrate$1;
__webpack_unused_export__ = VibrateOff$1;
__webpack_unused_export__ = Video$1;
__webpack_unused_export__ = VideoOff$1;
__webpack_unused_export__ = View$1;
__webpack_unused_export__ = Voicemail$1;
__webpack_unused_export__ = Volume$1;
__webpack_unused_export__ = Volume1$1;
__webpack_unused_export__ = Volume2$1;
__webpack_unused_export__ = VolumeX$1;
__webpack_unused_export__ = Wallet$1;
__webpack_unused_export__ = Wand$1;
__webpack_unused_export__ = Wand2$1;
__webpack_unused_export__ = Watch$1;
__webpack_unused_export__ = Waves$1;
__webpack_unused_export__ = Webcam$1;
__webpack_unused_export__ = Webhook$1;
__webpack_unused_export__ = Wifi$1;
__webpack_unused_export__ = WifiOff$1;
__webpack_unused_export__ = Wind$1;
__webpack_unused_export__ = Wine$1;
__webpack_unused_export__ = WrapText$1;
__webpack_unused_export__ = Wrench$1;
exports.X = X$1;
__webpack_unused_export__ = XCircle$1;
__webpack_unused_export__ = XOctagon$1;
__webpack_unused_export__ = XSquare$1;
__webpack_unused_export__ = Youtube$1;
__webpack_unused_export__ = Zap$1;
__webpack_unused_export__ = ZapOff$1;
__webpack_unused_export__ = ZoomIn$1;
__webpack_unused_export__ = ZoomOut$1;
__webpack_unused_export__ = createReactComponent;
//# sourceMappingURL=lucide-react.js.map


/***/ }),

/***/ 95176:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var e=__webpack_require__(18038);function t(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var n=/*#__PURE__*/t(e);const r=["light","dark"],a="(prefers-color-scheme: dark)",o="undefined"==typeof window,s=/*#__PURE__*/e.createContext(void 0),l={setTheme:e=>{},themes:[]},c=["light","dark"],m=({forcedTheme:t,disableTransitionOnChange:o=!1,enableSystem:l=!0,enableColorScheme:m=!0,storageKey:f="theme",themes:y=c,defaultTheme:v=(l?"system":"light"),attribute:$="data-theme",value:g,children:b,nonce:S})=>{const[T,p]=e.useState(()=>d(f,v)),[w,C]=e.useState(()=>d(f)),E=g?Object.values(g):y,k=e.useCallback(e=>{let t=e;if(!t)return;"system"===e&&l&&(t=h());const n=g?g[t]:t,a=o?u():null,s=document.documentElement;if("class"===$?(s.classList.remove(...E),n&&s.classList.add(n)):n?s.setAttribute($,n):s.removeAttribute($),m){const e=r.includes(v)?v:null,n=r.includes(t)?t:e;s.style.colorScheme=n}null==a||a()},[]),x=e.useCallback(e=>{p(e);try{localStorage.setItem(f,e)}catch(e){}},[t]),L=e.useCallback(e=>{const n=h(e);C(n),"system"===T&&l&&!t&&k("system")},[T,t]);e.useEffect(()=>{const e=window.matchMedia(a);return e.addListener(L),L(e),()=>e.removeListener(L)},[L]),e.useEffect(()=>{const e=e=>{e.key===f&&x(e.newValue||v)};return window.addEventListener("storage",e),()=>window.removeEventListener("storage",e)},[x]),e.useEffect(()=>{k(null!=t?t:T)},[t,T]);const I=e.useMemo(()=>({theme:T,setTheme:x,forcedTheme:t,resolvedTheme:"system"===T?w:T,themes:l?[...y,"system"]:y,systemTheme:l?w:void 0}),[T,x,t,w,l,y]);/*#__PURE__*/return n.default.createElement(s.Provider,{value:I},/*#__PURE__*/n.default.createElement(i,{forcedTheme:t,disableTransitionOnChange:o,enableSystem:l,enableColorScheme:m,storageKey:f,themes:y,defaultTheme:v,attribute:$,value:g,children:b,attrs:E,nonce:S}),b)},i=/*#__PURE__*/e.memo(({forcedTheme:e,storageKey:t,attribute:o,enableSystem:s,enableColorScheme:l,defaultTheme:c,value:m,attrs:i,nonce:d})=>{const u="system"===c,h="class"===o?`var d=document.documentElement,c=d.classList;c.remove(${i.map(e=>`'${e}'`).join(",")});`:`var d=document.documentElement,n='${o}',s='setAttribute';`,f=l?r.includes(c)&&c?`if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'${c}'`:"if(e==='light'||e==='dark')d.style.colorScheme=e":"",y=(e,t=!1,n=!0)=>{const a=m?m[e]:e,s=t?e+"|| ''":`'${a}'`;let c="";return l&&n&&!t&&r.includes(e)&&(c+=`d.style.colorScheme = '${e}';`),"class"===o?c+=t||a?`c.add(${s})`:"null":a&&(c+=`d[s](n,${s})`),c},v=e?`!function(){${h}${y(e)}}()`:s?`!function(){try{${h}var e=localStorage.getItem('${t}');if('system'===e||(!e&&${u})){var t='${a}',m=window.matchMedia(t);if(m.media!==t||m.matches){${y("dark")}}else{${y("light")}}}else if(e){${m?`var x=${JSON.stringify(m)};`:""}${y(m?"x[e]":"e",!0)}}${u?"":"else{"+y(c,!1,!1)+"}"}${f}}catch(e){}}()`:`!function(){try{${h}var e=localStorage.getItem('${t}');if(e){${m?`var x=${JSON.stringify(m)};`:""}${y(m?"x[e]":"e",!0)}}else{${y(c,!1,!1)};}${f}}catch(t){}}();`;/*#__PURE__*/return n.default.createElement("script",{nonce:d,dangerouslySetInnerHTML:{__html:v}})},()=>!0),d=(e,t)=>{if(o)return;let n;try{n=localStorage.getItem(e)||void 0}catch(e){}return n||t},u=()=>{const e=document.createElement("style");return e.appendChild(document.createTextNode("*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(e),()=>{window.getComputedStyle(document.body),setTimeout(()=>{document.head.removeChild(e)},1)}},h=e=>(e||(e=window.matchMedia(a)),e.matches?"dark":"light");exports.f=t=>e.useContext(s)?/*#__PURE__*/n.default.createElement(e.Fragment,null,t.children):/*#__PURE__*/n.default.createElement(m,t),exports.F=()=>{var t;return null!==(t=e.useContext(s))&&void 0!==t?t:l};


/***/ }),

/***/ 34759:
/***/ ((module) => {

// Exports
module.exports = {
	"style": {"fontFamily":"'__Inter_52d07b', '__Inter_Fallback_52d07b'","fontStyle":"normal"},
	"className": "__className_52d07b",
	"variable": "__variable_52d07b"
};


/***/ }),

/***/ 56861:
/***/ ((module) => {

// Exports
module.exports = {
	"style": {"fontFamily":"'__fontHeading_deb966', '__fontHeading_Fallback_deb966'"},
	"className": "__className_deb966",
	"variable": "__variable_deb966"
};


/***/ }),

/***/ 63022:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "addBasePath", ({
    enumerable: true,
    get: function() {
        return addBasePath;
    }
}));
const _addpathprefix = __webpack_require__(11751);
const _normalizetrailingslash = __webpack_require__(18115);
const basePath =  false || "";
function addBasePath(path, required) {
    if (false) {}
    return (0, _normalizetrailingslash.normalizePathTrailingSlash)((0, _addpathprefix.addPathPrefix)(path, basePath));
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=add-base-path.js.map


/***/ }),

/***/ 86942:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "callServer", ({
    enumerable: true,
    get: function() {
        return callServer;
    }
}));
const _client = __webpack_require__(97897);
async function callServer(id, args) {
    const actionId = id;
    // Fetching the current url with the action header.
    // TODO: Refactor this to look up from a manifest.
    const res = await fetch("", {
        method: "POST",
        headers: {
            Accept: "text/x-component",
            "Next-Action": actionId
        },
        body: await (0, _client.encodeReply)(args)
    });
    if (!res.ok) {
        throw new Error(await res.text());
    }
    return (await res.json())[0];
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=app-call-server.js.map


/***/ }),

/***/ 75087:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "AppRouterAnnouncer", ({
    enumerable: true,
    get: function() {
        return AppRouterAnnouncer;
    }
}));
const _react = __webpack_require__(18038);
const _reactdom = __webpack_require__(98704);
const ANNOUNCER_TYPE = "next-route-announcer";
const ANNOUNCER_ID = "__next-route-announcer__";
function getAnnouncerNode() {
    var _existingAnnouncer_shadowRoot;
    const existingAnnouncer = document.getElementsByName(ANNOUNCER_TYPE)[0];
    if (existingAnnouncer == null ? void 0 : (_existingAnnouncer_shadowRoot = existingAnnouncer.shadowRoot) == null ? void 0 : _existingAnnouncer_shadowRoot.childNodes[0]) {
        return existingAnnouncer.shadowRoot.childNodes[0];
    } else {
        const container = document.createElement(ANNOUNCER_TYPE);
        const announcer = document.createElement("div");
        announcer.setAttribute("aria-live", "assertive");
        announcer.setAttribute("id", ANNOUNCER_ID);
        announcer.setAttribute("role", "alert");
        announcer.style.cssText = "position:absolute;border:0;height:1px;margin:-1px;padding:0;width:1px;clip:rect(0 0 0 0);overflow:hidden;white-space:nowrap;word-wrap:normal";
        // Use shadow DOM here to avoid any potential CSS bleed
        const shadow = container.attachShadow({
            mode: "open"
        });
        shadow.appendChild(announcer);
        document.body.appendChild(container);
        return announcer;
    }
}
function AppRouterAnnouncer(param) {
    let { tree  } = param;
    const [portalNode, setPortalNode] = (0, _react.useState)(null);
    (0, _react.useEffect)(()=>{
        const announcer = getAnnouncerNode();
        setPortalNode(announcer);
        return ()=>{
            const container = document.getElementsByTagName(ANNOUNCER_TYPE)[0];
            if (container == null ? void 0 : container.isConnected) {
                document.body.removeChild(container);
            }
        };
    }, []);
    const [routeAnnouncement, setRouteAnnouncement] = (0, _react.useState)("");
    const previousTitle = (0, _react.useRef)();
    (0, _react.useEffect)(()=>{
        let currentTitle = "";
        if (document.title) {
            currentTitle = document.title;
        } else {
            const pageHeader = document.querySelector("h1");
            if (pageHeader) {
                currentTitle = pageHeader.innerText || pageHeader.textContent || "";
            }
        }
        // Only announce the title change, but not for the first load because screen
        // readers do that automatically.
        if (typeof previousTitle.current !== "undefined") {
            setRouteAnnouncement(currentTitle);
        }
        previousTitle.current = currentTitle;
    }, [
        tree
    ]);
    return portalNode ? /*#__PURE__*/ (0, _reactdom.createPortal)(routeAnnouncement, portalNode) : null;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=app-router-announcer.js.map


/***/ }),

/***/ 2982:
/***/ ((module, exports) => {

"use strict";

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
    RSC: function() {
        return RSC;
    },
    ACTION: function() {
        return ACTION;
    },
    NEXT_ROUTER_STATE_TREE: function() {
        return NEXT_ROUTER_STATE_TREE;
    },
    NEXT_ROUTER_PREFETCH: function() {
        return NEXT_ROUTER_PREFETCH;
    },
    NEXT_URL: function() {
        return NEXT_URL;
    },
    FETCH_CACHE_HEADER: function() {
        return FETCH_CACHE_HEADER;
    },
    RSC_CONTENT_TYPE_HEADER: function() {
        return RSC_CONTENT_TYPE_HEADER;
    },
    RSC_VARY_HEADER: function() {
        return RSC_VARY_HEADER;
    },
    FLIGHT_PARAMETERS: function() {
        return FLIGHT_PARAMETERS;
    }
});
const RSC = "RSC";
const ACTION = "Next-Action";
const NEXT_ROUTER_STATE_TREE = "Next-Router-State-Tree";
const NEXT_ROUTER_PREFETCH = "Next-Router-Prefetch";
const NEXT_URL = "Next-Url";
const FETCH_CACHE_HEADER = "x-vercel-sc-headers";
const RSC_CONTENT_TYPE_HEADER = "text/x-component";
const RSC_VARY_HEADER = RSC + ", " + NEXT_ROUTER_STATE_TREE + ", " + NEXT_ROUTER_PREFETCH;
const FLIGHT_PARAMETERS = [
    [
        RSC
    ],
    [
        NEXT_ROUTER_STATE_TREE
    ],
    [
        NEXT_ROUTER_PREFETCH
    ]
];
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=app-router-headers.js.map


/***/ }),

/***/ 89222:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* __next_internal_client_entry_do_not_use__  cjs */ 
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
    urlToUrlWithoutFlightMarker: function() {
        return urlToUrlWithoutFlightMarker;
    },
    default: function() {
        return AppRouter;
    }
});
const _interop_require_wildcard = __webpack_require__(41113);
const _react = /*#__PURE__*/ _interop_require_wildcard._(__webpack_require__(18038));
const _approutercontext = __webpack_require__(3280);
const _routerreducer = __webpack_require__(60542);
const _routerreducertypes = __webpack_require__(40664);
const _createhreffromurl = __webpack_require__(69897);
const _hooksclientcontext = __webpack_require__(69274);
const _usereducerwithdevtools = __webpack_require__(46958);
const _errorboundary = __webpack_require__(54765);
const _createinitialrouterstate = __webpack_require__(19188);
const _isbot = __webpack_require__(1897);
const _addbasepath = __webpack_require__(63022);
const _approuterannouncer = __webpack_require__(75087);
const _redirectboundary = __webpack_require__(43167);
const _notfoundboundary = __webpack_require__(56753);
const _findheadincache = __webpack_require__(61058);
const isServer = "undefined" === "undefined";
// Ensure the initialParallelRoutes are not combined because of double-rendering in the browser with Strict Mode.
let initialParallelRoutes = isServer ? null : new Map();
function urlToUrlWithoutFlightMarker(url) {
    const urlWithoutFlightParameters = new URL(url, location.origin);
    // TODO-APP: handle .rsc for static export case
    return urlWithoutFlightParameters;
}
const HotReloader =  true ? null : 0;
function isExternalURL(url) {
    return url.origin !== window.location.origin;
}
function HistoryUpdater(param) {
    let { tree , pushRef , canonicalUrl , sync  } = param;
    // @ts-ignore TODO-APP: useInsertionEffect is available
    _react.default.useInsertionEffect(()=>{
        // When mpaNavigation flag is set do a hard navigation to the new url.
        if (pushRef.mpaNavigation) {
            const location1 = window.location;
            if (pushRef.pendingPush) {
                location1.assign(canonicalUrl);
            } else {
                location1.replace(canonicalUrl);
            }
            return;
        }
        // Identifier is shortened intentionally.
        // __NA is used to identify if the history entry can be handled by the app-router.
        // __N is used to identify if the history entry can be handled by the old router.
        const historyState = {
            __NA: true,
            tree
        };
        if (pushRef.pendingPush && (0, _createhreffromurl.createHrefFromUrl)(new URL(window.location.href)) !== canonicalUrl) {
            // This intentionally mutates React state, pushRef is overwritten to ensure additional push/replace calls do not trigger an additional history entry.
            pushRef.pendingPush = false;
            window.history.pushState(historyState, "", canonicalUrl);
        } else {
            window.history.replaceState(historyState, "", canonicalUrl);
        }
        sync();
    }, [
        tree,
        pushRef,
        canonicalUrl,
        sync
    ]);
    return null;
}
/**
 * The global router that wraps the application components.
 */ function Router(param) {
    let { initialHead , initialTree , initialCanonicalUrl , children , assetPrefix , notFound , notFoundStyles , asNotFound  } = param;
    const initialState = (0, _react.useMemo)(()=>(0, _createinitialrouterstate.createInitialRouterState)({
            children,
            initialCanonicalUrl,
            initialTree,
            initialParallelRoutes,
            isServer,
            location: !isServer ? window.location : null,
            initialHead
        }), [
        children,
        initialCanonicalUrl,
        initialTree,
        initialHead
    ]);
    const [{ tree , cache , prefetchCache , pushRef , focusAndScrollRef , canonicalUrl , nextUrl  }, dispatch, sync] = (0, _usereducerwithdevtools.useReducerWithReduxDevtools)(_routerreducer.reducer, initialState);
    (0, _react.useEffect)(()=>{
        // Ensure initialParallelRoutes is cleaned up from memory once it's used.
        initialParallelRoutes = null;
    }, []);
    // Add memoized pathname/query for useSearchParams and usePathname.
    const { searchParams , pathname  } = (0, _react.useMemo)(()=>{
        const url = new URL(canonicalUrl,  true ? "http://n" : 0);
        return {
            // This is turned into a readonly class in `useSearchParams`
            searchParams: url.searchParams,
            pathname: url.pathname
        };
    }, [
        canonicalUrl
    ]);
    /**
   * Server response that only patches the cache and tree.
   */ const changeByServerResponse = (0, _react.useCallback)((previousTree, flightData, overrideCanonicalUrl)=>{
        dispatch({
            type: _routerreducertypes.ACTION_SERVER_PATCH,
            flightData,
            previousTree,
            overrideCanonicalUrl,
            cache: {
                status: _approutercontext.CacheStates.LAZY_INITIALIZED,
                data: null,
                subTreeData: null,
                parallelRoutes: new Map()
            },
            mutable: {}
        });
    }, [
        dispatch
    ]);
    /**
   * The app router that is exposed through `useRouter`. It's only concerned with dispatching actions to the reducer, does not hold state.
   */ const appRouter = (0, _react.useMemo)(()=>{
        const navigate = (href, navigateType, forceOptimisticNavigation)=>{
            const url = new URL((0, _addbasepath.addBasePath)(href), location.origin);
            return dispatch({
                type: _routerreducertypes.ACTION_NAVIGATE,
                url,
                isExternalUrl: isExternalURL(url),
                locationSearch: location.search,
                forceOptimisticNavigation,
                navigateType,
                cache: {
                    status: _approutercontext.CacheStates.LAZY_INITIALIZED,
                    data: null,
                    subTreeData: null,
                    parallelRoutes: new Map()
                },
                mutable: {}
            });
        };
        const routerInstance = {
            back: ()=>window.history.back(),
            forward: ()=>window.history.forward(),
            prefetch: (href, options)=>{
                // If prefetch has already been triggered, don't trigger it again.
                if ((0, _isbot.isBot)(window.navigator.userAgent)) {
                    return;
                }
                const url = new URL((0, _addbasepath.addBasePath)(href), location.origin);
                // External urls can't be prefetched in the same way.
                if (isExternalURL(url)) {
                    return;
                }
                // @ts-ignore startTransition exists
                _react.default.startTransition(()=>{
                    var _options_kind;
                    dispatch({
                        type: _routerreducertypes.ACTION_PREFETCH,
                        url,
                        kind: (_options_kind = options == null ? void 0 : options.kind) != null ? _options_kind : _routerreducertypes.PrefetchKind.FULL
                    });
                });
            },
            replace: (href, options)=>{
                if (options === void 0) options = {};
                // @ts-ignore startTransition exists
                _react.default.startTransition(()=>{
                    navigate(href, "replace", Boolean(options.forceOptimisticNavigation));
                });
            },
            push: (href, options)=>{
                if (options === void 0) options = {};
                // @ts-ignore startTransition exists
                _react.default.startTransition(()=>{
                    navigate(href, "push", Boolean(options.forceOptimisticNavigation));
                });
            },
            refresh: ()=>{
                // @ts-ignore startTransition exists
                _react.default.startTransition(()=>{
                    dispatch({
                        type: _routerreducertypes.ACTION_REFRESH,
                        cache: {
                            status: _approutercontext.CacheStates.LAZY_INITIALIZED,
                            data: null,
                            subTreeData: null,
                            parallelRoutes: new Map()
                        },
                        mutable: {},
                        origin: window.location.origin
                    });
                });
            },
            // @ts-ignore we don't want to expose this method at all
            fastRefresh: ()=>{
                if (true) {
                    throw new Error("fastRefresh can only be used in development mode. Please use refresh instead.");
                } else {}
            }
        };
        return routerInstance;
    }, [
        dispatch
    ]);
    // Add `window.nd` for debugging purposes.
    // This is not meant for use in applications as concurrent rendering will affect the cache/tree/router.
    if (false) {}
    /**
   * Handle popstate event, this is used to handle back/forward in the browser.
   * By default dispatches ACTION_RESTORE, however if the history entry was not pushed/replaced by app-router it will reload the page.
   * That case can happen when the old router injected the history entry.
   */ const onPopState = (0, _react.useCallback)((param)=>{
        let { state  } = param;
        if (!state) {
            // TODO-APP: this case only happens when pushState/replaceState was called outside of Next.js. It should probably reload the page in this case.
            return;
        }
        // This case happens when the history entry was pushed by the `pages` router.
        if (!state.__NA) {
            window.location.reload();
            return;
        }
        // @ts-ignore useTransition exists
        // TODO-APP: Ideally the back button should not use startTransition as it should apply the updates synchronously
        // Without startTransition works if the cache is there for this path
        _react.default.startTransition(()=>{
            dispatch({
                type: _routerreducertypes.ACTION_RESTORE,
                url: new URL(window.location.href),
                tree: state.tree
            });
        });
    }, [
        dispatch
    ]);
    // Register popstate event to call onPopstate.
    (0, _react.useEffect)(()=>{
        window.addEventListener("popstate", onPopState);
        return ()=>{
            window.removeEventListener("popstate", onPopState);
        };
    }, [
        onPopState
    ]);
    const head = (0, _react.useMemo)(()=>{
        return (0, _findheadincache.findHeadInCache)(cache, tree[1]);
    }, [
        cache,
        tree
    ]);
    const content = /*#__PURE__*/ _react.default.createElement(_notfoundboundary.NotFoundBoundary, {
        notFound: notFound,
        notFoundStyles: notFoundStyles,
        asNotFound: asNotFound
    }, /*#__PURE__*/ _react.default.createElement(_redirectboundary.RedirectBoundary, null, head, cache.subTreeData, /*#__PURE__*/ _react.default.createElement(_approuterannouncer.AppRouterAnnouncer, {
        tree: tree
    })));
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement(HistoryUpdater, {
        tree: tree,
        pushRef: pushRef,
        canonicalUrl: canonicalUrl,
        sync: sync
    }), /*#__PURE__*/ _react.default.createElement(_hooksclientcontext.PathnameContext.Provider, {
        value: pathname
    }, /*#__PURE__*/ _react.default.createElement(_hooksclientcontext.SearchParamsContext.Provider, {
        value: searchParams
    }, /*#__PURE__*/ _react.default.createElement(_approutercontext.GlobalLayoutRouterContext.Provider, {
        value: {
            changeByServerResponse,
            tree,
            focusAndScrollRef,
            nextUrl
        }
    }, /*#__PURE__*/ _react.default.createElement(_approutercontext.AppRouterContext.Provider, {
        value: appRouter
    }, /*#__PURE__*/ _react.default.createElement(_approutercontext.LayoutRouterContext.Provider, {
        value: {
            childNodes: cache.parallelRoutes,
            tree: tree,
            // Root node always has `url`
            // Provided in AppTreeContext to ensure it can be overwritten in layout-router
            url: canonicalUrl
        }
    }, HotReloader ? /*#__PURE__*/ _react.default.createElement(HotReloader, {
        assetPrefix: assetPrefix
    }, content) : content))))));
}
function AppRouter(props) {
    const { globalErrorComponent , ...rest } = props;
    return /*#__PURE__*/ _react.default.createElement(_errorboundary.ErrorBoundary, {
        errorComponent: globalErrorComponent
    }, /*#__PURE__*/ _react.default.createElement(Router, rest));
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=app-router.js.map


/***/ }),

/***/ 86650:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "bailoutToClientRendering", ({
    enumerable: true,
    get: function() {
        return bailoutToClientRendering;
    }
}));
const _dynamicnossr = __webpack_require__(92144);
const _staticgenerationasyncstorage = __webpack_require__(1839);
function bailoutToClientRendering() {
    const staticGenerationStore = _staticgenerationasyncstorage.staticGenerationAsyncStorage.getStore();
    if (staticGenerationStore == null ? void 0 : staticGenerationStore.forceStatic) {
        return true;
    }
    if (staticGenerationStore == null ? void 0 : staticGenerationStore.isStaticGeneration) {
        (0, _dynamicnossr.suspense)();
    }
    return false;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=bailout-to-client-rendering.js.map


/***/ }),

/***/ 26378:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "clientHookInServerComponentError", ({
    enumerable: true,
    get: function() {
        return clientHookInServerComponentError;
    }
}));
const _interop_require_default = __webpack_require__(95967);
const _react = /*#__PURE__*/ _interop_require_default._(__webpack_require__(18038));
function clientHookInServerComponentError(hookName) {
    if (false) {}
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=client-hook-in-server-component-error.js.map


/***/ }),

/***/ 54765:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* __next_internal_client_entry_do_not_use__  cjs */ 
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
    ErrorBoundaryHandler: function() {
        return ErrorBoundaryHandler;
    },
    default: function() {
        return GlobalError;
    },
    ErrorBoundary: function() {
        return ErrorBoundary;
    }
});
const _interop_require_default = __webpack_require__(95967);
const _react = /*#__PURE__*/ _interop_require_default._(__webpack_require__(18038));
const styles = {
    error: {
        // https://github.com/sindresorhus/modern-normalize/blob/main/modern-normalize.css#L38-L52
        fontFamily: 'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
        height: "100vh",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    desc: {
        textAlign: "left"
    },
    text: {
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "3em",
        margin: 0
    }
};
class ErrorBoundaryHandler extends _react.default.Component {
    static getDerivedStateFromError(error) {
        return {
            error
        };
    }
    render() {
        if (this.state.error) {
            return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, this.props.errorStyles, /*#__PURE__*/ _react.default.createElement(this.props.errorComponent, {
                error: this.state.error,
                reset: this.reset
            }));
        }
        return this.props.children;
    }
    constructor(props){
        super(props);
        this.reset = ()=>{
            this.setState({
                error: null
            });
        };
        this.state = {
            error: null
        };
    }
}
function GlobalError(param) {
    let { error  } = param;
    return /*#__PURE__*/ _react.default.createElement("html", null, /*#__PURE__*/ _react.default.createElement("head", null), /*#__PURE__*/ _react.default.createElement("body", null, /*#__PURE__*/ _react.default.createElement("div", {
        style: styles.error
    }, /*#__PURE__*/ _react.default.createElement("div", {
        style: styles.desc
    }, /*#__PURE__*/ _react.default.createElement("h2", {
        style: styles.text
    }, "Application error: a client-side exception has occurred (see the browser console for more information)."), (error == null ? void 0 : error.digest) && /*#__PURE__*/ _react.default.createElement("p", {
        style: styles.text
    }, "Digest: " + error.digest)))));
}
function ErrorBoundary(param) {
    let { errorComponent , errorStyles , children  } = param;
    if (errorComponent) {
        return /*#__PURE__*/ _react.default.createElement(ErrorBoundaryHandler, {
            errorComponent: errorComponent,
            errorStyles: errorStyles
        }, children);
    }
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, children);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=error-boundary.js.map


/***/ }),

/***/ 65404:
/***/ ((module, exports) => {

"use strict";

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
    DYNAMIC_ERROR_CODE: function() {
        return DYNAMIC_ERROR_CODE;
    },
    DynamicServerError: function() {
        return DynamicServerError;
    }
});
const DYNAMIC_ERROR_CODE = "DYNAMIC_SERVER_USAGE";
class DynamicServerError extends Error {
    constructor(type){
        super("Dynamic server usage: " + type);
        this.digest = DYNAMIC_ERROR_CODE;
    }
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=hooks-server-context.js.map


/***/ }),

/***/ 80947:
/***/ ((module, exports) => {

"use strict";
/**
 * Used to cache in createInfinitePromise
 */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "createInfinitePromise", ({
    enumerable: true,
    get: function() {
        return createInfinitePromise;
    }
}));
let infinitePromise;
function createInfinitePromise() {
    if (!infinitePromise) {
        // Only create the Promise once
        infinitePromise = new Promise(()=>{
        // This is used to debug when the rendering is never updated.
        // setTimeout(() => {
        //   infinitePromise = new Error('Infinite promise')
        //   resolve()
        // }, 5000)
        });
    }
    return infinitePromise;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=infinite-promise.js.map


/***/ }),

/***/ 78301:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* __next_internal_client_entry_do_not_use__  cjs */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "default", ({
    enumerable: true,
    get: function() {
        return OuterLayoutRouter;
    }
}));
const _interop_require_default = __webpack_require__(95967);
const _interop_require_wildcard = __webpack_require__(41113);
const _react = /*#__PURE__*/ _interop_require_wildcard._(__webpack_require__(18038));
const _reactdom = /*#__PURE__*/ _interop_require_default._(__webpack_require__(98704));
const _approutercontext = __webpack_require__(3280);
const _fetchserverresponse = __webpack_require__(64599);
const _infinitepromise = __webpack_require__(80947);
const _errorboundary = __webpack_require__(54765);
const _matchsegments = __webpack_require__(28226);
const _handlesmoothscroll = __webpack_require__(21668);
const _redirectboundary = __webpack_require__(43167);
const _notfoundboundary = __webpack_require__(56753);
const _getsegmentvalue = __webpack_require__(48672);
const _createroutercachekey = __webpack_require__(48627);
/**
 * Add refetch marker to router state at the point of the current layout segment.
 * This ensures the response returned is not further down than the current layout segment.
 */ function walkAddRefetch(segmentPathToWalk, treeToRecreate) {
    if (segmentPathToWalk) {
        const [segment, parallelRouteKey] = segmentPathToWalk;
        const isLast = segmentPathToWalk.length === 2;
        if ((0, _matchsegments.matchSegment)(treeToRecreate[0], segment)) {
            if (treeToRecreate[1].hasOwnProperty(parallelRouteKey)) {
                if (isLast) {
                    const subTree = walkAddRefetch(undefined, treeToRecreate[1][parallelRouteKey]);
                    return [
                        treeToRecreate[0],
                        {
                            ...treeToRecreate[1],
                            [parallelRouteKey]: [
                                subTree[0],
                                subTree[1],
                                subTree[2],
                                "refetch"
                            ]
                        }
                    ];
                }
                return [
                    treeToRecreate[0],
                    {
                        ...treeToRecreate[1],
                        [parallelRouteKey]: walkAddRefetch(segmentPathToWalk.slice(2), treeToRecreate[1][parallelRouteKey])
                    }
                ];
            }
        }
    }
    return treeToRecreate;
}
// TODO-APP: Replace with new React API for finding dom nodes without a `ref` when available
/**
 * Wraps ReactDOM.findDOMNode with additional logic to hide React Strict Mode warning
 */ function findDOMNode(instance) {
    // Tree-shake for server bundle
    if (true) return null;
    // Only apply strict mode warning when not in production
    if (false) {}
    return _reactdom.default.findDOMNode(instance);
}
const rectProperties = [
    "bottom",
    "height",
    "left",
    "right",
    "top",
    "width",
    "x",
    "y"
];
/**
 * Check if a HTMLElement is hidden.
 */ function elementCanScroll(element) {
    // Uses `getBoundingClientRect` to check if the element is hidden instead of `offsetParent`
    // because `offsetParent` doesn't consider document/body
    const rect = element.getBoundingClientRect();
    return rectProperties.every((item)=>rect[item] === 0);
}
/**
 * Check if the top corner of the HTMLElement is in the viewport.
 */ function topOfElementInViewport(element, viewportHeight) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.top <= viewportHeight;
}
/**
 * Find the DOM node for a hash fragment.
 * If `top` the page has to scroll to the top of the page. This mirrors the browser's behavior.
 * If the hash fragment is an id, the page has to scroll to the element with that id.
 * If the hash fragment is a name, the page has to scroll to the first element with that name.
 */ function getHashFragmentDomNode(hashFragment) {
    // If the hash fragment is `top` the page has to scroll to the top of the page.
    if (hashFragment === "top") {
        return document.body;
    }
    var _document_getElementById;
    // If the hash fragment is an id, the page has to scroll to the element with that id.
    return (_document_getElementById = document.getElementById(hashFragment)) != null ? _document_getElementById : document.getElementsByName(hashFragment)[0];
}
class ScrollAndFocusHandler extends _react.default.Component {
    componentDidMount() {
        this.handlePotentialScroll();
    }
    componentDidUpdate() {
        // Because this property is overwritten in handlePotentialScroll it's fine to always run it when true as it'll be set to false for subsequent renders.
        if (this.props.focusAndScrollRef.apply) {
            this.handlePotentialScroll();
        }
    }
    render() {
        return this.props.children;
    }
    constructor(...args){
        super(...args);
        this.handlePotentialScroll = ()=>{
            // Handle scroll and focus, it's only applied once in the first useEffect that triggers that changed.
            const { focusAndScrollRef , segmentPath  } = this.props;
            if (focusAndScrollRef.apply) {
                // segmentPaths is an array of segment paths that should be scrolled to
                // if the current segment path is not in the array, the scroll is not applied
                // unless the array is empty, in which case the scroll is always applied
                if (focusAndScrollRef.segmentPaths.length !== 0 && !focusAndScrollRef.segmentPaths.some((scrollRefSegmentPath)=>segmentPath.every((segment, index)=>(0, _matchsegments.matchSegment)(segment, scrollRefSegmentPath[index])))) {
                    return;
                }
                let domNode = null;
                const hashFragment = focusAndScrollRef.hashFragment;
                if (hashFragment) {
                    domNode = getHashFragmentDomNode(hashFragment);
                }
                // `findDOMNode` is tricky because it returns just the first child if the component is a fragment.
                // This already caused a bug where the first child was a <link/> in head.
                if (!domNode) {
                    domNode = findDOMNode(this);
                }
                // TODO-APP: Handle the case where we couldn't select any DOM node, even higher up in the layout-router above the current segmentPath.
                // If there is no DOM node this layout-router level is skipped. It'll be handled higher-up in the tree.
                if (!(domNode instanceof Element)) {
                    return;
                }
                // Verify if the element is a HTMLElement and if it's visible on screen (e.g. not display: none).
                // If the element is not a HTMLElement or not visible we try to select the next sibling and try again.
                while(!(domNode instanceof HTMLElement) || elementCanScroll(domNode)){
                    // TODO-APP: Handle the case where we couldn't select any DOM node, even higher up in the layout-router above the current segmentPath.
                    // No siblings found that are visible so we handle scroll higher up in the tree instead.
                    if (domNode.nextElementSibling === null) {
                        return;
                    }
                    domNode = domNode.nextElementSibling;
                }
                // State is mutated to ensure that the focus and scroll is applied only once.
                focusAndScrollRef.apply = false;
                (0, _handlesmoothscroll.handleSmoothScroll)(()=>{
                    // In case of hash scroll we need to scroll to the top of the element
                    if (hashFragment) {
                        window.scrollTo(0, domNode.offsetTop);
                        return;
                    }
                    // Store the current viewport height because reading `clientHeight` causes a reflow,
                    // and it won't change during this function.
                    const htmlElement = document.documentElement;
                    const viewportHeight = htmlElement.clientHeight;
                    // If the element's top edge is already in the viewport, exit early.
                    if (topOfElementInViewport(domNode, viewportHeight)) {
                        return;
                    }
                    // Otherwise, try scrolling go the top of the document to be backward compatible with pages
                    // scrollIntoView() called on `<html/>` element scrolls horizontally on chrome and firefox (that shouldn't happen)
                    // We could use it to scroll horizontally following RTL but that also seems to be broken - it will always scroll left
                    // scrollLeft = 0 also seems to ignore RTL and manually checking for RTL is too much hassle so we will scroll just vertically
                    htmlElement.scrollTop = 0;
                    // Scroll to domNode if domNode is not in viewport when scrolled to top of document
                    if (!topOfElementInViewport(domNode, viewportHeight)) {
                        domNode.scrollIntoView();
                    }
                }, {
                    // We will force layout by querying domNode position
                    dontForceLayout: true
                });
                // Set focus on the element
                domNode.focus();
            }
        };
    }
}
/**
 * InnerLayoutRouter handles rendering the provided segment based on the cache.
 */ function InnerLayoutRouter(param) {
    let { parallelRouterKey , url , childNodes , childProp , segmentPath , tree , // isActive,
    cacheKey  } = param;
    const context = (0, _react.useContext)(_approutercontext.GlobalLayoutRouterContext);
    if (!context) {
        throw new Error("invariant global layout router not mounted");
    }
    const { changeByServerResponse , tree: fullTree , focusAndScrollRef  } = context;
    // Read segment path from the parallel router cache node.
    let childNode = childNodes.get(cacheKey);
    // If childProp is available this means it's the Flight / SSR case.
    if (childProp && // TODO-APP: verify if this can be null based on user code
    childProp.current !== null) {
        if (!childNode) {
            // Add the segment's subTreeData to the cache.
            // This writes to the cache when there is no item in the cache yet. It never *overwrites* existing cache items which is why it's safe in concurrent mode.
            childNodes.set(cacheKey, {
                status: _approutercontext.CacheStates.READY,
                data: null,
                subTreeData: childProp.current,
                parallelRoutes: new Map()
            });
            // In the above case childNode was set on childNodes, so we have to get it from the cacheNodes again.
            childNode = childNodes.get(cacheKey);
        } else {
            if (childNode.status === _approutercontext.CacheStates.LAZY_INITIALIZED) {
                // @ts-expect-error we're changing it's type!
                childNode.status = _approutercontext.CacheStates.READY;
                // @ts-expect-error
                childNode.subTreeData = childProp.current;
            }
        }
    }
    // When childNode is not available during rendering client-side we need to fetch it from the server.
    if (!childNode || childNode.status === _approutercontext.CacheStates.LAZY_INITIALIZED) {
        /**
     * Router state with refetch marker added
     */ // TODO-APP: remove ''
        const refetchTree = walkAddRefetch([
            "",
            ...segmentPath
        ], fullTree);
        /**
     * Flight data fetch kicked off during render and put into the cache.
     */ childNodes.set(cacheKey, {
            status: _approutercontext.CacheStates.DATA_FETCH,
            data: (0, _fetchserverresponse.fetchServerResponse)(new URL(url, location.origin), refetchTree, context.nextUrl),
            subTreeData: null,
            head: childNode && childNode.status === _approutercontext.CacheStates.LAZY_INITIALIZED ? childNode.head : undefined,
            parallelRoutes: childNode && childNode.status === _approutercontext.CacheStates.LAZY_INITIALIZED ? childNode.parallelRoutes : new Map()
        });
        // In the above case childNode was set on childNodes, so we have to get it from the cacheNodes again.
        childNode = childNodes.get(cacheKey);
    }
    // This case should never happen so it throws an error. It indicates there's a bug in the Next.js.
    if (!childNode) {
        throw new Error("Child node should always exist");
    }
    // This case should never happen so it throws an error. It indicates there's a bug in the Next.js.
    if (childNode.subTreeData && childNode.data) {
        throw new Error("Child node should not have both subTreeData and data");
    }
    // If cache node has a data request we have to unwrap response by `use` and update the cache.
    if (childNode.data) {
        /**
     * Flight response data
     */ // When the data has not resolved yet `use` will suspend here.
        const [flightData, overrideCanonicalUrl] = (0, _react.use)(childNode.data);
        // Handle case when navigating to page in `pages` from `app`
        if (typeof flightData === "string") {
            window.location.href = url;
            return null;
        }
        // segmentPath from the server does not match the layout's segmentPath
        childNode.data = null;
        // setTimeout is used to start a new transition during render, this is an intentional hack around React.
        setTimeout(()=>{
            // @ts-ignore startTransition exists
            _react.default.startTransition(()=>{
                changeByServerResponse(fullTree, flightData, overrideCanonicalUrl);
            });
        });
        // Suspend infinitely as `changeByServerResponse` will cause a different part of the tree to be rendered.
        (0, _react.use)((0, _infinitepromise.createInfinitePromise)());
    }
    // If cache node has no subTreeData and no data request we have to infinitely suspend as the data will likely flow in from another place.
    // TODO-APP: double check users can't return null in a component that will kick in here.
    if (!childNode.subTreeData) {
        (0, _react.use)((0, _infinitepromise.createInfinitePromise)());
    }
    const subtree = /*#__PURE__*/ _react.default.createElement(_approutercontext.LayoutRouterContext.Provider, {
        value: {
            tree: tree[1][parallelRouterKey],
            childNodes: childNode.parallelRoutes,
            // TODO-APP: overriding of url for parallel routes
            url: url
        }
    }, childNode.subTreeData);
    // Ensure root layout is not wrapped in a div as the root layout renders `<html>`
    return /*#__PURE__*/ _react.default.createElement(ScrollAndFocusHandler, {
        focusAndScrollRef: focusAndScrollRef,
        segmentPath: segmentPath
    }, subtree);
}
/**
 * Renders suspense boundary with the provided "loading" property as the fallback.
 * If no loading property is provided it renders the children without a suspense boundary.
 */ function LoadingBoundary(param) {
    let { children , loading , loadingStyles , hasLoading  } = param;
    if (hasLoading) {
        return /*#__PURE__*/ _react.default.createElement(_react.default.Suspense, {
            fallback: /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, loadingStyles, loading)
        }, children);
    }
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, children);
}
function OuterLayoutRouter(param) {
    let { parallelRouterKey , segmentPath , childProp , error , errorStyles , templateStyles , loading , loadingStyles , hasLoading , template , notFound , notFoundStyles , asNotFound , styles  } = param;
    const context = (0, _react.useContext)(_approutercontext.LayoutRouterContext);
    if (!context) {
        throw new Error("invariant expected layout router to be mounted");
    }
    const { childNodes , tree , url  } = context;
    // Get the current parallelRouter cache node
    let childNodesForParallelRouter = childNodes.get(parallelRouterKey);
    // If the parallel router cache node does not exist yet, create it.
    // This writes to the cache when there is no item in the cache yet. It never *overwrites* existing cache items which is why it's safe in concurrent mode.
    if (!childNodesForParallelRouter) {
        childNodes.set(parallelRouterKey, new Map());
        childNodesForParallelRouter = childNodes.get(parallelRouterKey);
    }
    // Get the active segment in the tree
    // The reason arrays are used in the data format is that these are transferred from the server to the browser so it's optimized to save bytes.
    const treeSegment = tree[1][parallelRouterKey][0];
    const childPropSegment = childProp.segment;
    // If segment is an array it's a dynamic route and we want to read the dynamic route value as the segment to get from the cache.
    const currentChildSegmentValue = (0, _getsegmentvalue.getSegmentValue)(treeSegment);
    /**
   * Decides which segments to keep rendering, all segments that are not active will be wrapped in `<Offscreen>`.
   */ // TODO-APP: Add handling of `<Offscreen>` when it's available.
    const preservedSegments = [
        treeSegment
    ];
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, styles, preservedSegments.map((preservedSegment)=>{
        const isChildPropSegment = (0, _matchsegments.matchSegment)(preservedSegment, childPropSegment);
        const preservedSegmentValue = (0, _getsegmentvalue.getSegmentValue)(preservedSegment);
        const cacheKey = (0, _createroutercachekey.createRouterCacheKey)(preservedSegment);
        return(/*
            - Error boundary
              - Only renders error boundary if error component is provided.
              - Rendered for each segment to ensure they have their own error state.
            - Loading boundary
              - Only renders suspense boundary if loading components is provided.
              - Rendered for each segment to ensure they have their own loading state.
              - Passed to the router during rendering to ensure it can be immediately rendered when suspending on a Flight fetch.
          */ /*#__PURE__*/ _react.default.createElement(_approutercontext.TemplateContext.Provider, {
            key: cacheKey,
            value: /*#__PURE__*/ _react.default.createElement(_errorboundary.ErrorBoundary, {
                errorComponent: error,
                errorStyles: errorStyles
            }, /*#__PURE__*/ _react.default.createElement(LoadingBoundary, {
                hasLoading: hasLoading,
                loading: loading,
                loadingStyles: loadingStyles
            }, /*#__PURE__*/ _react.default.createElement(_notfoundboundary.NotFoundBoundary, {
                notFound: notFound,
                notFoundStyles: notFoundStyles,
                asNotFound: asNotFound
            }, /*#__PURE__*/ _react.default.createElement(_redirectboundary.RedirectBoundary, null, /*#__PURE__*/ _react.default.createElement(InnerLayoutRouter, {
                parallelRouterKey: parallelRouterKey,
                url: url,
                tree: tree,
                childNodes: childNodesForParallelRouter,
                childProp: isChildPropSegment ? childProp : null,
                segmentPath: segmentPath,
                cacheKey: cacheKey,
                isActive: currentChildSegmentValue === preservedSegmentValue
            })))))
        }, /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, templateStyles, template)));
    }));
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=layout-router.js.map


/***/ }),

/***/ 28226:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

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
    matchSegment: function() {
        return matchSegment;
    },
    canSegmentBeOverridden: function() {
        return canSegmentBeOverridden;
    }
});
const _getsegmentparam = __webpack_require__(61090);
const matchSegment = (existingSegment, segment)=>{
    // Common case: segment is just a string
    if (typeof existingSegment === "string" && typeof segment === "string") {
        return existingSegment === segment;
    }
    // Dynamic parameter case: segment is an array with param/value. Both param and value are compared.
    if (Array.isArray(existingSegment) && Array.isArray(segment)) {
        return existingSegment[0] === segment[0] && existingSegment[1] === segment[1];
    }
    return false;
};
const canSegmentBeOverridden = (existingSegment, segment)=>{
    var _getSegmentParam;
    if (Array.isArray(existingSegment) || !Array.isArray(segment)) {
        return false;
    }
    return ((_getSegmentParam = (0, _getsegmentparam.getSegmentParam)(existingSegment)) == null ? void 0 : _getSegmentParam.param) === segment[0];
};
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=match-segments.js.map


/***/ }),

/***/ 84592:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
// useLayoutSegments() // Only the segments for the current place. ['children', 'dashboard', 'children', 'integrations'] -> /dashboard/integrations (/dashboard/layout.js would get ['children', 'dashboard', 'children', 'integrations'])

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
    ReadonlyURLSearchParams: function() {
        return ReadonlyURLSearchParams;
    },
    useSearchParams: function() {
        return useSearchParams;
    },
    usePathname: function() {
        return usePathname;
    },
    ServerInsertedHTMLContext: function() {
        return _serverinsertedhtml.ServerInsertedHTMLContext;
    },
    useServerInsertedHTML: function() {
        return _serverinsertedhtml.useServerInsertedHTML;
    },
    useRouter: function() {
        return useRouter;
    },
    useParams: function() {
        return useParams;
    },
    useSelectedLayoutSegments: function() {
        return useSelectedLayoutSegments;
    },
    useSelectedLayoutSegment: function() {
        return useSelectedLayoutSegment;
    },
    redirect: function() {
        return _redirect.redirect;
    },
    notFound: function() {
        return _notfound.notFound;
    }
});
const _react = __webpack_require__(18038);
const _approutercontext = __webpack_require__(3280);
const _hooksclientcontext = __webpack_require__(69274);
const _clienthookinservercomponenterror = __webpack_require__(26378);
const _getsegmentvalue = __webpack_require__(48672);
const _serverinsertedhtml = __webpack_require__(3349);
const _redirect = __webpack_require__(58305);
const _notfound = __webpack_require__(55771);
const INTERNAL_URLSEARCHPARAMS_INSTANCE = Symbol("internal for urlsearchparams readonly");
function readonlyURLSearchParamsError() {
    return new Error("ReadonlyURLSearchParams cannot be modified");
}
class ReadonlyURLSearchParams {
    [Symbol.iterator]() {
        return this[INTERNAL_URLSEARCHPARAMS_INSTANCE][Symbol.iterator]();
    }
    append() {
        throw readonlyURLSearchParamsError();
    }
    delete() {
        throw readonlyURLSearchParamsError();
    }
    set() {
        throw readonlyURLSearchParamsError();
    }
    sort() {
        throw readonlyURLSearchParamsError();
    }
    constructor(urlSearchParams){
        this[INTERNAL_URLSEARCHPARAMS_INSTANCE] = urlSearchParams;
        this.entries = urlSearchParams.entries.bind(urlSearchParams);
        this.forEach = urlSearchParams.forEach.bind(urlSearchParams);
        this.get = urlSearchParams.get.bind(urlSearchParams);
        this.getAll = urlSearchParams.getAll.bind(urlSearchParams);
        this.has = urlSearchParams.has.bind(urlSearchParams);
        this.keys = urlSearchParams.keys.bind(urlSearchParams);
        this.values = urlSearchParams.values.bind(urlSearchParams);
        this.toString = urlSearchParams.toString.bind(urlSearchParams);
    }
}
function useSearchParams() {
    (0, _clienthookinservercomponenterror.clientHookInServerComponentError)("useSearchParams");
    const searchParams = (0, _react.useContext)(_hooksclientcontext.SearchParamsContext);
    // In the case where this is `null`, the compat types added in
    // `next-env.d.ts` will add a new overload that changes the return type to
    // include `null`.
    const readonlySearchParams = (0, _react.useMemo)(()=>{
        if (!searchParams) {
            // When the router is not ready in pages, we won't have the search params
            // available.
            return null;
        }
        return new ReadonlyURLSearchParams(searchParams);
    }, [
        searchParams
    ]);
    if (true) {
        // AsyncLocalStorage should not be included in the client bundle.
        const { bailoutToClientRendering  } = __webpack_require__(86650);
        if (bailoutToClientRendering()) {
            // TODO-APP: handle dynamic = 'force-static' here and on the client
            return readonlySearchParams;
        }
    }
    return readonlySearchParams;
}
function usePathname() {
    (0, _clienthookinservercomponenterror.clientHookInServerComponentError)("usePathname");
    // In the case where this is `null`, the compat types added in `next-env.d.ts`
    // will add a new overload that changes the return type to include `null`.
    return (0, _react.useContext)(_hooksclientcontext.PathnameContext);
}
function useRouter() {
    (0, _clienthookinservercomponenterror.clientHookInServerComponentError)("useRouter");
    const router = (0, _react.useContext)(_approutercontext.AppRouterContext);
    if (router === null) {
        throw new Error("invariant expected app router to be mounted");
    }
    return router;
}
// TODO-APP: handle parallel routes
function getSelectedParams(tree, params) {
    if (params === void 0) params = {};
    // After first parallel route prefer children, if there's no children pick the first parallel route.
    const parallelRoutes = tree[1];
    var _parallelRoutes_children;
    const node = (_parallelRoutes_children = parallelRoutes.children) != null ? _parallelRoutes_children : Object.values(parallelRoutes)[0];
    if (!node) return params;
    const segment = node[0];
    const isDynamicParameter = Array.isArray(segment);
    const segmentValue = isDynamicParameter ? segment[1] : segment;
    if (!segmentValue || segmentValue.startsWith("__PAGE__")) return params;
    if (isDynamicParameter) {
        params[segment[0]] = segment[1];
    }
    return getSelectedParams(node, params);
}
function useParams() {
    (0, _clienthookinservercomponenterror.clientHookInServerComponentError)("useParams");
    const globalLayoutRouterContext = (0, _react.useContext)(_approutercontext.GlobalLayoutRouterContext);
    if (!globalLayoutRouterContext) {
        // This only happens in `pages`. Type is overwritten in navigation.d.ts
        return null;
    }
    return getSelectedParams(globalLayoutRouterContext.tree);
}
// TODO-APP: handle parallel routes
/**
 * Get the canonical parameters from the current level to the leaf node.
 */ function getSelectedLayoutSegmentPath(tree, parallelRouteKey, first, segmentPath) {
    if (first === void 0) first = true;
    if (segmentPath === void 0) segmentPath = [];
    let node;
    if (first) {
        // Use the provided parallel route key on the first parallel route
        node = tree[1][parallelRouteKey];
    } else {
        // After first parallel route prefer children, if there's no children pick the first parallel route.
        const parallelRoutes = tree[1];
        var _parallelRoutes_children;
        node = (_parallelRoutes_children = parallelRoutes.children) != null ? _parallelRoutes_children : Object.values(parallelRoutes)[0];
    }
    if (!node) return segmentPath;
    const segment = node[0];
    const segmentValue = (0, _getsegmentvalue.getSegmentValue)(segment);
    if (!segmentValue || segmentValue.startsWith("__PAGE__")) return segmentPath;
    segmentPath.push(segmentValue);
    return getSelectedLayoutSegmentPath(node, parallelRouteKey, false, segmentPath);
}
function useSelectedLayoutSegments(parallelRouteKey) {
    if (parallelRouteKey === void 0) parallelRouteKey = "children";
    (0, _clienthookinservercomponenterror.clientHookInServerComponentError)("useSelectedLayoutSegments");
    const { tree  } = (0, _react.useContext)(_approutercontext.LayoutRouterContext);
    return getSelectedLayoutSegmentPath(tree, parallelRouteKey);
}
function useSelectedLayoutSegment(parallelRouteKey) {
    if (parallelRouteKey === void 0) parallelRouteKey = "children";
    (0, _clienthookinservercomponenterror.clientHookInServerComponentError)("useSelectedLayoutSegment");
    const selectedLayoutSegments = useSelectedLayoutSegments(parallelRouteKey);
    if (selectedLayoutSegments.length === 0) {
        return null;
    }
    return selectedLayoutSegments[0];
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=navigation.js.map


/***/ }),

/***/ 56753:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "NotFoundBoundary", ({
    enumerable: true,
    get: function() {
        return NotFoundBoundary;
    }
}));
const _interop_require_default = __webpack_require__(95967);
const _react = /*#__PURE__*/ _interop_require_default._(__webpack_require__(18038));
class NotFoundErrorBoundary extends _react.default.Component {
    static getDerivedStateFromError(error) {
        if ((error == null ? void 0 : error.digest) === "NEXT_NOT_FOUND") {
            return {
                notFoundTriggered: true
            };
        }
        // Re-throw if error is not for 404
        throw error;
    }
    render() {
        if (this.state.notFoundTriggered) {
            return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("meta", {
                name: "robots",
                content: "noindex"
            }), this.props.notFoundStyles, this.props.notFound);
        }
        return this.props.children;
    }
    constructor(props){
        super(props);
        this.state = {
            notFoundTriggered: !!props.asNotFound
        };
    }
}
function NotFoundBoundary(param) {
    let { notFound , notFoundStyles , asNotFound , children  } = param;
    return notFound ? /*#__PURE__*/ _react.default.createElement(NotFoundErrorBoundary, {
        notFound: notFound,
        notFoundStyles: notFoundStyles,
        asNotFound: asNotFound
    }, children) : /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, children);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=not-found-boundary.js.map


/***/ }),

/***/ 55771:
/***/ ((module, exports) => {

"use strict";

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
    notFound: function() {
        return notFound;
    },
    isNotFoundError: function() {
        return isNotFoundError;
    }
});
const NOT_FOUND_ERROR_CODE = "NEXT_NOT_FOUND";
function notFound() {
    // eslint-disable-next-line no-throw-literal
    const error = new Error(NOT_FOUND_ERROR_CODE);
    error.digest = NOT_FOUND_ERROR_CODE;
    throw error;
}
function isNotFoundError(error) {
    return (error == null ? void 0 : error.digest) === NOT_FOUND_ERROR_CODE;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=not-found.js.map


/***/ }),

/***/ 43167:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* __next_internal_client_entry_do_not_use__  cjs */ 
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
    RedirectErrorBoundary: function() {
        return RedirectErrorBoundary;
    },
    RedirectBoundary: function() {
        return RedirectBoundary;
    }
});
const _interop_require_wildcard = __webpack_require__(41113);
const _react = /*#__PURE__*/ _interop_require_wildcard._(__webpack_require__(18038));
const _navigation = __webpack_require__(84592);
const _redirect = __webpack_require__(58305);
function HandleRedirect(param) {
    let { redirect , reset  } = param;
    const router = (0, _navigation.useRouter)();
    (0, _react.useEffect)(()=>{
        // @ts-ignore startTransition exists
        _react.default.startTransition(()=>{
            router.replace(redirect, {});
            reset();
        });
    }, [
        redirect,
        reset,
        router
    ]);
    return null;
}
class RedirectErrorBoundary extends _react.default.Component {
    static getDerivedStateFromError(error) {
        if ((0, _redirect.isRedirectError)(error)) {
            const url = (0, _redirect.getURLFromRedirectError)(error);
            return {
                redirect: url
            };
        }
        // Re-throw if error is not for redirect
        throw error;
    }
    render() {
        const redirect = this.state.redirect;
        if (redirect !== null) {
            return /*#__PURE__*/ _react.default.createElement(HandleRedirect, {
                redirect: redirect,
                reset: ()=>this.setState({
                        redirect: null
                    })
            });
        }
        return this.props.children;
    }
    constructor(props){
        super(props);
        this.state = {
            redirect: null
        };
    }
}
function RedirectBoundary(param) {
    let { children  } = param;
    const router = (0, _navigation.useRouter)();
    return /*#__PURE__*/ _react.default.createElement(RedirectErrorBoundary, {
        router: router
    }, children);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=redirect-boundary.js.map


/***/ }),

/***/ 58305:
/***/ ((module, exports) => {

"use strict";

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
    redirect: function() {
        return redirect;
    },
    isRedirectError: function() {
        return isRedirectError;
    },
    getURLFromRedirectError: function() {
        return getURLFromRedirectError;
    }
});
const REDIRECT_ERROR_CODE = "NEXT_REDIRECT";
function redirect(url) {
    // eslint-disable-next-line no-throw-literal
    const error = new Error(REDIRECT_ERROR_CODE);
    error.digest = REDIRECT_ERROR_CODE + ";" + url;
    throw error;
}
function isRedirectError(error) {
    return typeof (error == null ? void 0 : error.digest) === "string" && error.digest.startsWith(REDIRECT_ERROR_CODE + ";") && error.digest.length > REDIRECT_ERROR_CODE.length + 1;
}
function getURLFromRedirectError(error) {
    if (!isRedirectError(error)) return null;
    // Slices off the beginning of the digest that contains the code and the
    // separating ';'.
    return error.digest.slice(REDIRECT_ERROR_CODE.length + 1);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=redirect.js.map


/***/ }),

/***/ 83751:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* __next_internal_client_entry_do_not_use__  cjs */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "default", ({
    enumerable: true,
    get: function() {
        return RenderFromTemplateContext;
    }
}));
const _interop_require_wildcard = __webpack_require__(41113);
const _react = /*#__PURE__*/ _interop_require_wildcard._(__webpack_require__(18038));
const _approutercontext = __webpack_require__(3280);
function RenderFromTemplateContext() {
    const children = (0, _react.useContext)(_approutercontext.TemplateContext);
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, children);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=render-from-template-context.js.map


/***/ }),

/***/ 84403:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "applyFlightData", ({
    enumerable: true,
    get: function() {
        return applyFlightData;
    }
}));
const _approutercontext = __webpack_require__(3280);
const _filllazyitemstillleafwithhead = __webpack_require__(82494);
const _fillcachewithnewsubtreedata = __webpack_require__(5940);
function applyFlightData(existingCache, cache, flightDataPath, wasPrefetched) {
    if (wasPrefetched === void 0) wasPrefetched = false;
    // The one before last item is the router state tree patch
    const [treePatch, subTreeData, head] = flightDataPath.slice(-3);
    // Handles case where prefetch only returns the router tree patch without rendered components.
    if (subTreeData === null) {
        return false;
    }
    if (flightDataPath.length === 3) {
        cache.status = _approutercontext.CacheStates.READY;
        cache.subTreeData = subTreeData;
        (0, _filllazyitemstillleafwithhead.fillLazyItemsTillLeafWithHead)(cache, existingCache, treePatch, head, wasPrefetched);
    } else {
        // Copy subTreeData for the root node of the cache.
        cache.status = _approutercontext.CacheStates.READY;
        cache.subTreeData = existingCache.subTreeData;
        cache.parallelRoutes = new Map(existingCache.parallelRoutes);
        // Create a copy of the existing cache with the subTreeData applied.
        (0, _fillcachewithnewsubtreedata.fillCacheWithNewSubTreeData)(cache, existingCache, flightDataPath, wasPrefetched);
    }
    return true;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=apply-flight-data.js.map


/***/ }),

/***/ 68018:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "applyRouterStatePatchToTree", ({
    enumerable: true,
    get: function() {
        return applyRouterStatePatchToTree;
    }
}));
const _matchsegments = __webpack_require__(28226);
/**
 * Deep merge of the two router states. Parallel route keys are preserved if the patch doesn't have them.
 */ function applyPatch(initialTree, patchTree) {
    const [initialSegment, initialParallelRoutes] = initialTree;
    const [patchSegment, patchParallelRoutes] = patchTree;
    // if the applied patch segment is __DEFAULT__ then we can ignore it and return the initial tree
    // this is because the __DEFAULT__ segment is used as a placeholder on navigation
    if (patchSegment === "__DEFAULT__" && initialSegment !== "__DEFAULT__") {
        return initialTree;
    }
    if ((0, _matchsegments.matchSegment)(initialSegment, patchSegment)) {
        const newParallelRoutes = {};
        for(const key in initialParallelRoutes){
            const isInPatchTreeParallelRoutes = typeof patchParallelRoutes[key] !== "undefined";
            if (isInPatchTreeParallelRoutes) {
                newParallelRoutes[key] = applyPatch(initialParallelRoutes[key], patchParallelRoutes[key]);
            } else {
                newParallelRoutes[key] = initialParallelRoutes[key];
            }
        }
        for(const key in patchParallelRoutes){
            if (newParallelRoutes[key]) {
                continue;
            }
            newParallelRoutes[key] = patchParallelRoutes[key];
        }
        const tree = [
            initialSegment,
            newParallelRoutes
        ];
        if (initialTree[2]) {
            tree[2] = initialTree[2];
        }
        if (initialTree[3]) {
            tree[3] = initialTree[3];
        }
        if (initialTree[4]) {
            tree[4] = initialTree[4];
        }
        return tree;
    }
    return patchTree;
}
function applyRouterStatePatchToTree(flightSegmentPath, flightRouterState, treePatch) {
    const [segment, parallelRoutes, , , isRootLayout] = flightRouterState;
    // Root refresh
    if (flightSegmentPath.length === 1) {
        const tree = applyPatch(flightRouterState, treePatch);
        return tree;
    }
    const [currentSegment, parallelRouteKey] = flightSegmentPath;
    // Tree path returned from the server should always match up with the current tree in the browser
    if (!(0, _matchsegments.matchSegment)(currentSegment, segment)) {
        return null;
    }
    const lastSegment = flightSegmentPath.length === 2;
    let parallelRoutePatch;
    if (lastSegment) {
        parallelRoutePatch = applyPatch(parallelRoutes[parallelRouteKey], treePatch);
    } else {
        parallelRoutePatch = applyRouterStatePatchToTree(flightSegmentPath.slice(2), parallelRoutes[parallelRouteKey], treePatch);
        if (parallelRoutePatch === null) {
            return null;
        }
    }
    const tree = [
        flightSegmentPath[0],
        {
            ...parallelRoutes,
            [parallelRouteKey]: parallelRoutePatch
        }
    ];
    // Current segment is the root layout
    if (isRootLayout) {
        tree[4] = true;
    }
    return tree;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=apply-router-state-patch-to-tree.js.map


/***/ }),

/***/ 50947:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

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
    extractPathFromFlightRouterState: function() {
        return extractPathFromFlightRouterState;
    },
    computeChangedPath: function() {
        return computeChangedPath;
    }
});
const _interceptionroutes = __webpack_require__(78652);
const _matchsegments = __webpack_require__(28226);
const segmentToPathname = (segment)=>{
    if (typeof segment === "string") {
        return segment;
    }
    return segment[1];
};
function normalizePathname(pathname) {
    return pathname.split("/").reduce((acc, segment)=>{
        if (segment === "" || segment.startsWith("(") && segment.endsWith(")")) {
            return acc;
        }
        return acc + "/" + segment;
    }, "");
}
function extractPathFromFlightRouterState(flightRouterState) {
    const segment = Array.isArray(flightRouterState[0]) ? flightRouterState[0][1] : flightRouterState[0];
    if (segment === "__DEFAULT__" || _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.some((m)=>segment.startsWith(m))) return undefined;
    if (segment.startsWith("__PAGE__")) return "";
    const path = [
        segment
    ];
    var _flightRouterState_;
    const parallelRoutes = (_flightRouterState_ = flightRouterState[1]) != null ? _flightRouterState_ : {};
    const childrenPath = parallelRoutes.children ? extractPathFromFlightRouterState(parallelRoutes.children) : undefined;
    if (childrenPath !== undefined) {
        path.push(childrenPath);
    } else {
        for (const [key, value] of Object.entries(parallelRoutes)){
            if (key === "children") continue;
            const childPath = extractPathFromFlightRouterState(value);
            if (childPath !== undefined) {
                path.push(childPath);
            }
        }
    }
    // TODO-APP: optimise this, it's not ideal to join and split
    return normalizePathname(path.join("/"));
}
function computeChangedPathImpl(treeA, treeB) {
    const [segmentA, parallelRoutesA] = treeA;
    const [segmentB, parallelRoutesB] = treeB;
    const normalizedSegmentA = segmentToPathname(segmentA);
    const normalizedSegmentB = segmentToPathname(segmentB);
    if (_interceptionroutes.INTERCEPTION_ROUTE_MARKERS.some((m)=>normalizedSegmentA.startsWith(m) || normalizedSegmentB.startsWith(m))) {
        return "";
    }
    if (!(0, _matchsegments.matchSegment)(segmentA, segmentB)) {
        var _extractPathFromFlightRouterState;
        // once we find where the tree changed, we compute the rest of the path by traversing the tree
        return (_extractPathFromFlightRouterState = extractPathFromFlightRouterState(treeB)) != null ? _extractPathFromFlightRouterState : "";
    }
    for(const parallelRouterKey in parallelRoutesA){
        if (parallelRoutesB[parallelRouterKey]) {
            const changedPath = computeChangedPathImpl(parallelRoutesA[parallelRouterKey], parallelRoutesB[parallelRouterKey]);
            if (changedPath !== null) {
                return segmentToPathname(segmentB) + "/" + changedPath;
            }
        }
    }
    return null;
}
function computeChangedPath(treeA, treeB) {
    const changedPath = computeChangedPathImpl(treeA, treeB);
    if (changedPath == null || changedPath === "/") {
        return changedPath;
    }
    // lightweight normalization to remove route groups
    return normalizePathname(changedPath);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=compute-changed-path.js.map


/***/ }),

/***/ 69897:
/***/ ((module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "createHrefFromUrl", ({
    enumerable: true,
    get: function() {
        return createHrefFromUrl;
    }
}));
function createHrefFromUrl(url, includeHash) {
    if (includeHash === void 0) includeHash = true;
    return url.pathname + url.search + (includeHash ? url.hash : "");
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=create-href-from-url.js.map


/***/ }),

/***/ 19188:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "createInitialRouterState", ({
    enumerable: true,
    get: function() {
        return createInitialRouterState;
    }
}));
const _approutercontext = __webpack_require__(3280);
const _createhreffromurl = __webpack_require__(69897);
const _filllazyitemstillleafwithhead = __webpack_require__(82494);
const _computechangedpath = __webpack_require__(50947);
function createInitialRouterState(param) {
    let { initialTree , children , initialCanonicalUrl , initialParallelRoutes , isServer , location , initialHead  } = param;
    const cache = {
        status: _approutercontext.CacheStates.READY,
        data: null,
        subTreeData: children,
        // The cache gets seeded during the first render. `initialParallelRoutes` ensures the cache from the first render is there during the second render.
        parallelRoutes: isServer ? new Map() : initialParallelRoutes
    };
    // When the cache hasn't been seeded yet we fill the cache with the head.
    if (initialParallelRoutes === null || initialParallelRoutes.size === 0) {
        (0, _filllazyitemstillleafwithhead.fillLazyItemsTillLeafWithHead)(cache, undefined, initialTree, initialHead);
    }
    var _ref;
    return {
        tree: initialTree,
        cache,
        prefetchCache: new Map(),
        pushRef: {
            pendingPush: false,
            mpaNavigation: false
        },
        focusAndScrollRef: {
            apply: false,
            hashFragment: null,
            segmentPaths: []
        },
        canonicalUrl: // This is safe to do as canonicalUrl can't be rendered, it's only used to control the history updates in the useEffect further down in this file.
        location ? (0, _createhreffromurl.createHrefFromUrl)(location) : initialCanonicalUrl,
        nextUrl: (_ref = (0, _computechangedpath.extractPathFromFlightRouterState)(initialTree) || (location == null ? void 0 : location.pathname)) != null ? _ref : null
    };
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=create-initial-router-state.js.map


/***/ }),

/***/ 27120:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "createOptimisticTree", ({
    enumerable: true,
    get: function() {
        return createOptimisticTree;
    }
}));
const _matchsegments = __webpack_require__(28226);
function createOptimisticTree(segments, flightRouterState, parentRefetch) {
    const [existingSegment, existingParallelRoutes, url, refresh, isRootLayout] = flightRouterState || [
        null,
        {}
    ];
    const segment = segments[0];
    const isLastSegment = segments.length === 1;
    const segmentMatches = existingSegment !== null && (0, _matchsegments.matchSegment)(existingSegment, segment);
    // if there are multiple parallel routes at this level, we need to refetch here
    // to ensure we get the correct tree. This is because we don't know which
    // parallel route will match the next segment.
    const hasMultipleParallelRoutes = Object.keys(existingParallelRoutes).length > 1;
    const shouldRefetchThisLevel = !flightRouterState || !segmentMatches || hasMultipleParallelRoutes;
    let parallelRoutes = {};
    if (existingSegment !== null && segmentMatches) {
        parallelRoutes = existingParallelRoutes;
    }
    let childTree;
    // if there's multiple parallel routes at this level, we shouldn't create an
    // optimistic tree for the next level because we don't know which one will
    // match the next segment.
    if (!isLastSegment && !hasMultipleParallelRoutes) {
        const childItem = createOptimisticTree(segments.slice(1), parallelRoutes ? parallelRoutes.children : null, parentRefetch || shouldRefetchThisLevel);
        childTree = childItem;
    }
    const result = [
        segment,
        {
            ...parallelRoutes,
            ...childTree ? {
                children: childTree
            } : {}
        }
    ];
    if (url) {
        result[2] = url;
    }
    if (!parentRefetch && shouldRefetchThisLevel) {
        result[3] = "refetch";
    } else if (segmentMatches && refresh) {
        result[3] = refresh;
    }
    if (segmentMatches && isRootLayout) {
        result[4] = isRootLayout;
    }
    return result;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=create-optimistic-tree.js.map


/***/ }),

/***/ 79669:
/***/ ((module, exports) => {

"use strict";
/**
 * Create data fetching record for Promise.
 */ // TODO-APP: change `any` to type inference.

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "createRecordFromThenable", ({
    enumerable: true,
    get: function() {
        return createRecordFromThenable;
    }
}));
function createRecordFromThenable(thenable) {
    thenable.status = "pending";
    thenable.then((value)=>{
        if (thenable.status === "pending") {
            thenable.status = "fulfilled";
            thenable.value = value;
        }
    }, (err)=>{
        if (thenable.status === "pending") {
            thenable.status = "rejected";
            thenable.value = err;
        }
    });
    return thenable;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=create-record-from-thenable.js.map


/***/ }),

/***/ 48627:
/***/ ((module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "createRouterCacheKey", ({
    enumerable: true,
    get: function() {
        return createRouterCacheKey;
    }
}));
function createRouterCacheKey(segment) {
    return Array.isArray(segment) ? segment[0] + "|" + segment[1] + "|" + segment[2] : segment;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=create-router-cache-key.js.map


/***/ }),

/***/ 64599:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* __next_internal_client_entry_do_not_use__  cjs */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "fetchServerResponse", ({
    enumerable: true,
    get: function() {
        return fetchServerResponse;
    }
}));
const _client = __webpack_require__(97897);
const _approuterheaders = __webpack_require__(2982);
const _approuter = __webpack_require__(89222);
const _appcallserver = __webpack_require__(86942);
const _routerreducertypes = __webpack_require__(40664);
async function fetchServerResponse(url, flightRouterState, nextUrl, prefetchKind) {
    const headers = {
        // Enable flight response
        [_approuterheaders.RSC]: "1",
        // Provide the current router state
        [_approuterheaders.NEXT_ROUTER_STATE_TREE]: JSON.stringify(flightRouterState)
    };
    /**
   * Three cases:
   * - `prefetchKind` is `undefined`, it means it's a normal navigation, so we want to prefetch the page data fully
   * - `prefetchKind` is `full` - we want to prefetch the whole page so same as above
   * - `prefetchKind` is `auto` - if the page is dynamic, prefetch the page data partially, if static prefetch the page data fully
   */ if (prefetchKind === _routerreducertypes.PrefetchKind.AUTO) {
        headers[_approuterheaders.NEXT_ROUTER_PREFETCH] = "1";
    }
    if (nextUrl) {
        headers[_approuterheaders.NEXT_URL] = nextUrl;
    }
    try {
        let fetchUrl = url;
        if (true) {
            if (false) {}
        }
        const res = await fetch(fetchUrl, {
            // Backwards compat for older browsers. `same-origin` is the default in modern browsers.
            credentials: "same-origin",
            headers
        });
        const canonicalUrl = res.redirected ? (0, _approuter.urlToUrlWithoutFlightMarker)(res.url) : undefined;
        const contentType = res.headers.get("content-type") || "";
        let isFlightResponse = contentType === _approuterheaders.RSC_CONTENT_TYPE_HEADER;
        if (true) {
            if (false) {}
        }
        // If fetch returns something different than flight response handle it like a mpa navigation
        if (!isFlightResponse) {
            return [
                res.url,
                undefined
            ];
        }
        // Handle the `fetch` readable stream that can be unwrapped by `React.use`.
        const flightData = await (0, _client.createFromFetch)(Promise.resolve(res), {
            callServer: _appcallserver.callServer
        });
        return [
            flightData,
            canonicalUrl
        ];
    } catch (err) {
        console.error("Failed to fetch RSC payload. Falling back to browser navigation.", err);
        // If fetch fails handle it like a mpa navigation
        // TODO-APP: Add a test for the case where a CORS request fails, e.g. external url redirect coming from the response.
        // See https://github.com/vercel/next.js/issues/43605#issuecomment-1451617521 for a reproduction.
        return [
            url.toString(),
            undefined
        ];
    }
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=fetch-server-response.js.map


/***/ }),

/***/ 23514:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "fillCacheWithDataProperty", ({
    enumerable: true,
    get: function() {
        return fillCacheWithDataProperty;
    }
}));
const _approutercontext = __webpack_require__(3280);
const _createroutercachekey = __webpack_require__(48627);
function fillCacheWithDataProperty(newCache, existingCache, flightSegmentPath, fetchResponse, bailOnParallelRoutes) {
    if (bailOnParallelRoutes === void 0) bailOnParallelRoutes = false;
    const isLastEntry = flightSegmentPath.length <= 2;
    const [parallelRouteKey, segment] = flightSegmentPath;
    const cacheKey = (0, _createroutercachekey.createRouterCacheKey)(segment);
    const existingChildSegmentMap = existingCache.parallelRoutes.get(parallelRouteKey);
    if (!existingChildSegmentMap || bailOnParallelRoutes && existingCache.parallelRoutes.size > 1) {
        // Bailout because the existing cache does not have the path to the leaf node
        // or the existing cache has multiple parallel routes
        // Will trigger lazy fetch in layout-router because of missing segment
        return {
            bailOptimistic: true
        };
    }
    let childSegmentMap = newCache.parallelRoutes.get(parallelRouteKey);
    if (!childSegmentMap || childSegmentMap === existingChildSegmentMap) {
        childSegmentMap = new Map(existingChildSegmentMap);
        newCache.parallelRoutes.set(parallelRouteKey, childSegmentMap);
    }
    const existingChildCacheNode = existingChildSegmentMap.get(cacheKey);
    let childCacheNode = childSegmentMap.get(cacheKey);
    // In case of last segment start off the fetch at this level and don't copy further down.
    if (isLastEntry) {
        if (!childCacheNode || !childCacheNode.data || childCacheNode === existingChildCacheNode) {
            childSegmentMap.set(cacheKey, {
                status: _approutercontext.CacheStates.DATA_FETCH,
                data: fetchResponse(),
                subTreeData: null,
                parallelRoutes: new Map()
            });
        }
        return;
    }
    if (!childCacheNode || !existingChildCacheNode) {
        // Start fetch in the place where the existing cache doesn't have the data yet.
        if (!childCacheNode) {
            childSegmentMap.set(cacheKey, {
                status: _approutercontext.CacheStates.DATA_FETCH,
                data: fetchResponse(),
                subTreeData: null,
                parallelRoutes: new Map()
            });
        }
        return;
    }
    if (childCacheNode === existingChildCacheNode) {
        childCacheNode = {
            status: childCacheNode.status,
            data: childCacheNode.data,
            subTreeData: childCacheNode.subTreeData,
            parallelRoutes: new Map(childCacheNode.parallelRoutes)
        };
        childSegmentMap.set(cacheKey, childCacheNode);
    }
    return fillCacheWithDataProperty(childCacheNode, existingChildCacheNode, flightSegmentPath.slice(2), fetchResponse);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=fill-cache-with-data-property.js.map


/***/ }),

/***/ 5940:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "fillCacheWithNewSubTreeData", ({
    enumerable: true,
    get: function() {
        return fillCacheWithNewSubTreeData;
    }
}));
const _approutercontext = __webpack_require__(3280);
const _invalidatecachebyrouterstate = __webpack_require__(51408);
const _filllazyitemstillleafwithhead = __webpack_require__(82494);
const _createroutercachekey = __webpack_require__(48627);
function fillCacheWithNewSubTreeData(newCache, existingCache, flightDataPath, wasPrefetched) {
    const isLastEntry = flightDataPath.length <= 5;
    const [parallelRouteKey, segment] = flightDataPath;
    const cacheKey = (0, _createroutercachekey.createRouterCacheKey)(segment);
    const existingChildSegmentMap = existingCache.parallelRoutes.get(parallelRouteKey);
    if (!existingChildSegmentMap) {
        // Bailout because the existing cache does not have the path to the leaf node
        // Will trigger lazy fetch in layout-router because of missing segment
        return;
    }
    let childSegmentMap = newCache.parallelRoutes.get(parallelRouteKey);
    if (!childSegmentMap || childSegmentMap === existingChildSegmentMap) {
        childSegmentMap = new Map(existingChildSegmentMap);
        newCache.parallelRoutes.set(parallelRouteKey, childSegmentMap);
    }
    const existingChildCacheNode = existingChildSegmentMap.get(cacheKey);
    let childCacheNode = childSegmentMap.get(cacheKey);
    if (isLastEntry) {
        if (!childCacheNode || !childCacheNode.data || childCacheNode === existingChildCacheNode) {
            childCacheNode = {
                status: _approutercontext.CacheStates.READY,
                data: null,
                subTreeData: flightDataPath[3],
                // Ensure segments other than the one we got data for are preserved.
                parallelRoutes: existingChildCacheNode ? new Map(existingChildCacheNode.parallelRoutes) : new Map()
            };
            if (existingChildCacheNode) {
                (0, _invalidatecachebyrouterstate.invalidateCacheByRouterState)(childCacheNode, existingChildCacheNode, flightDataPath[2]);
            }
            (0, _filllazyitemstillleafwithhead.fillLazyItemsTillLeafWithHead)(childCacheNode, existingChildCacheNode, flightDataPath[2], flightDataPath[4], wasPrefetched);
            childSegmentMap.set(cacheKey, childCacheNode);
        }
        return;
    }
    if (!childCacheNode || !existingChildCacheNode) {
        // Bailout because the existing cache does not have the path to the leaf node
        // Will trigger lazy fetch in layout-router because of missing segment
        return;
    }
    if (childCacheNode === existingChildCacheNode) {
        childCacheNode = {
            status: childCacheNode.status,
            data: childCacheNode.data,
            subTreeData: childCacheNode.subTreeData,
            parallelRoutes: new Map(childCacheNode.parallelRoutes)
        };
        childSegmentMap.set(cacheKey, childCacheNode);
    }
    fillCacheWithNewSubTreeData(childCacheNode, existingChildCacheNode, flightDataPath.slice(2), wasPrefetched);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=fill-cache-with-new-subtree-data.js.map


/***/ }),

/***/ 82494:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "fillLazyItemsTillLeafWithHead", ({
    enumerable: true,
    get: function() {
        return fillLazyItemsTillLeafWithHead;
    }
}));
const _approutercontext = __webpack_require__(3280);
const _createroutercachekey = __webpack_require__(48627);
function fillLazyItemsTillLeafWithHead(newCache, existingCache, routerState, head, wasPrefetched) {
    const isLastSegment = Object.keys(routerState[1]).length === 0;
    if (isLastSegment) {
        newCache.head = head;
        return;
    }
    // Remove segment that we got data for so that it is filled in during rendering of subTreeData.
    for(const key in routerState[1]){
        const parallelRouteState = routerState[1][key];
        const segmentForParallelRoute = parallelRouteState[0];
        const cacheKey = (0, _createroutercachekey.createRouterCacheKey)(segmentForParallelRoute);
        if (existingCache) {
            const existingParallelRoutesCacheNode = existingCache.parallelRoutes.get(key);
            if (existingParallelRoutesCacheNode) {
                let parallelRouteCacheNode = new Map(existingParallelRoutesCacheNode);
                const existingCacheNode = parallelRouteCacheNode.get(cacheKey);
                const newCacheNode = wasPrefetched && existingCacheNode ? {
                    status: existingCacheNode.status,
                    data: existingCacheNode.data,
                    subTreeData: existingCacheNode.subTreeData,
                    parallelRoutes: new Map(existingCacheNode.parallelRoutes)
                } : {
                    status: _approutercontext.CacheStates.LAZY_INITIALIZED,
                    data: null,
                    subTreeData: null,
                    parallelRoutes: new Map(existingCacheNode == null ? void 0 : existingCacheNode.parallelRoutes)
                };
                // Overrides the cache key with the new cache node.
                parallelRouteCacheNode.set(cacheKey, newCacheNode);
                // Traverse deeper to apply the head / fill lazy items till the head.
                fillLazyItemsTillLeafWithHead(newCacheNode, existingCacheNode, parallelRouteState, head, wasPrefetched);
                newCache.parallelRoutes.set(key, parallelRouteCacheNode);
                continue;
            }
        }
        const newCacheNode = {
            status: _approutercontext.CacheStates.LAZY_INITIALIZED,
            data: null,
            subTreeData: null,
            parallelRoutes: new Map()
        };
        const existingParallelRoutes = newCache.parallelRoutes.get(key);
        if (existingParallelRoutes) {
            existingParallelRoutes.set(cacheKey, newCacheNode);
        } else {
            newCache.parallelRoutes.set(key, new Map([
                [
                    cacheKey,
                    newCacheNode
                ]
            ]));
        }
        fillLazyItemsTillLeafWithHead(newCacheNode, undefined, parallelRouteState, head, wasPrefetched);
    }
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=fill-lazy-items-till-leaf-with-head.js.map


/***/ }),

/***/ 21447:
/***/ ((module, exports) => {

"use strict";

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
    PrefetchCacheEntryStatus: function() {
        return PrefetchCacheEntryStatus;
    },
    getPrefetchEntryCacheStatus: function() {
        return getPrefetchEntryCacheStatus;
    }
});
const FIVE_MINUTES = 5 * 60 * 1000;
const THIRTY_SECONDS = 30 * 1000;
var PrefetchCacheEntryStatus;
(function(PrefetchCacheEntryStatus) {
    PrefetchCacheEntryStatus["fresh"] = "fresh";
    PrefetchCacheEntryStatus["reusable"] = "reusable";
    PrefetchCacheEntryStatus["expired"] = "expired";
    PrefetchCacheEntryStatus["stale"] = "stale";
})(PrefetchCacheEntryStatus || (PrefetchCacheEntryStatus = {}));
function getPrefetchEntryCacheStatus(param) {
    let { kind , prefetchTime , lastUsedTime  } = param;
    // if the cache entry was prefetched or read less than 30s ago, then we want to re-use it
    if (Date.now() < (lastUsedTime != null ? lastUsedTime : prefetchTime) + THIRTY_SECONDS) {
        return lastUsedTime ? "reusable" : "fresh";
    }
    // if the cache entry was prefetched less than 5 mins ago, then we want to re-use only the loading state
    if (kind === "auto") {
        if (Date.now() < prefetchTime + FIVE_MINUTES) {
            return "stale";
        }
    }
    // if the cache entry was prefetched less than 5 mins ago and was a "full" prefetch, then we want to re-use it "full
    if (kind === "full") {
        if (Date.now() < prefetchTime + FIVE_MINUTES) {
            return "reusable";
        }
    }
    return "expired";
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=get-prefetch-cache-entry-status.js.map


/***/ }),

/***/ 48207:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "handleMutable", ({
    enumerable: true,
    get: function() {
        return handleMutable;
    }
}));
const _computechangedpath = __webpack_require__(50947);
function handleMutable(state, mutable) {
    var _mutable_scrollableSegments, _computeChangedPath;
    return {
        // Set href.
        canonicalUrl: typeof mutable.canonicalUrl !== "undefined" ? mutable.canonicalUrl === state.canonicalUrl ? state.canonicalUrl : mutable.canonicalUrl : state.canonicalUrl,
        pushRef: {
            pendingPush: typeof mutable.pendingPush !== "undefined" ? mutable.pendingPush : state.pushRef.pendingPush,
            mpaNavigation: typeof mutable.mpaNavigation !== "undefined" ? mutable.mpaNavigation : state.pushRef.mpaNavigation
        },
        // All navigation requires scroll and focus management to trigger.
        focusAndScrollRef: {
            apply: (mutable == null ? void 0 : mutable.scrollableSegments) !== undefined ? true : state.focusAndScrollRef.apply,
            hashFragment: // #top is handled in layout-router.
            mutable.hashFragment && mutable.hashFragment !== "" ? decodeURIComponent(mutable.hashFragment.slice(1)) : state.focusAndScrollRef.hashFragment,
            segmentPaths: (_mutable_scrollableSegments = mutable == null ? void 0 : mutable.scrollableSegments) != null ? _mutable_scrollableSegments : state.focusAndScrollRef.segmentPaths
        },
        // Apply cache.
        cache: mutable.cache ? mutable.cache : state.cache,
        prefetchCache: mutable.prefetchCache ? mutable.prefetchCache : state.prefetchCache,
        // Apply patched router state.
        tree: typeof mutable.patchedTree !== "undefined" ? mutable.patchedTree : state.tree,
        nextUrl: typeof mutable.patchedTree !== "undefined" ? (_computeChangedPath = (0, _computechangedpath.computeChangedPath)(state.tree, mutable.patchedTree)) != null ? _computeChangedPath : state.canonicalUrl : state.nextUrl
    };
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=handle-mutable.js.map


/***/ }),

/***/ 39337:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "invalidateCacheBelowFlightSegmentPath", ({
    enumerable: true,
    get: function() {
        return invalidateCacheBelowFlightSegmentPath;
    }
}));
const _createroutercachekey = __webpack_require__(48627);
function invalidateCacheBelowFlightSegmentPath(newCache, existingCache, flightSegmentPath) {
    const isLastEntry = flightSegmentPath.length <= 2;
    const [parallelRouteKey, segment] = flightSegmentPath;
    const cacheKey = (0, _createroutercachekey.createRouterCacheKey)(segment);
    const existingChildSegmentMap = existingCache.parallelRoutes.get(parallelRouteKey);
    if (!existingChildSegmentMap) {
        // Bailout because the existing cache does not have the path to the leaf node
        // Will trigger lazy fetch in layout-router because of missing segment
        return;
    }
    let childSegmentMap = newCache.parallelRoutes.get(parallelRouteKey);
    if (!childSegmentMap || childSegmentMap === existingChildSegmentMap) {
        childSegmentMap = new Map(existingChildSegmentMap);
        newCache.parallelRoutes.set(parallelRouteKey, childSegmentMap);
    }
    // In case of last entry don't copy further down.
    if (isLastEntry) {
        childSegmentMap.delete(cacheKey);
        return;
    }
    const existingChildCacheNode = existingChildSegmentMap.get(cacheKey);
    let childCacheNode = childSegmentMap.get(cacheKey);
    if (!childCacheNode || !existingChildCacheNode) {
        // Bailout because the existing cache does not have the path to the leaf node
        // Will trigger lazy fetch in layout-router because of missing segment
        return;
    }
    if (childCacheNode === existingChildCacheNode) {
        childCacheNode = {
            status: childCacheNode.status,
            data: childCacheNode.data,
            subTreeData: childCacheNode.subTreeData,
            parallelRoutes: new Map(childCacheNode.parallelRoutes)
        };
        childSegmentMap.set(cacheKey, childCacheNode);
    }
    invalidateCacheBelowFlightSegmentPath(childCacheNode, existingChildCacheNode, flightSegmentPath.slice(2));
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=invalidate-cache-below-flight-segmentpath.js.map


/***/ }),

/***/ 51408:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "invalidateCacheByRouterState", ({
    enumerable: true,
    get: function() {
        return invalidateCacheByRouterState;
    }
}));
const _createroutercachekey = __webpack_require__(48627);
function invalidateCacheByRouterState(newCache, existingCache, routerState) {
    // Remove segment that we got data for so that it is filled in during rendering of subTreeData.
    for(const key in routerState[1]){
        const segmentForParallelRoute = routerState[1][key][0];
        const cacheKey = (0, _createroutercachekey.createRouterCacheKey)(segmentForParallelRoute);
        const existingParallelRoutesCacheNode = existingCache.parallelRoutes.get(key);
        if (existingParallelRoutesCacheNode) {
            let parallelRouteCacheNode = new Map(existingParallelRoutesCacheNode);
            parallelRouteCacheNode.delete(cacheKey);
            newCache.parallelRoutes.set(key, parallelRouteCacheNode);
        }
    }
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=invalidate-cache-by-router-state.js.map


/***/ }),

/***/ 35991:
/***/ ((module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "isNavigatingToNewRootLayout", ({
    enumerable: true,
    get: function() {
        return isNavigatingToNewRootLayout;
    }
}));
function isNavigatingToNewRootLayout(currentTree, nextTree) {
    // Compare segments
    const currentTreeSegment = currentTree[0];
    const nextTreeSegment = nextTree[0];
    // If any segment is different before we find the root layout, the root layout has changed.
    // E.g. /same/(group1)/layout.js -> /same/(group2)/layout.js
    // First segment is 'same' for both, keep looking. (group1) changed to (group2) before the root layout was found, it must have changed.
    if (Array.isArray(currentTreeSegment) && Array.isArray(nextTreeSegment)) {
        // Compare dynamic param name and type but ignore the value, different values would not affect the current root layout
        // /[name] - /slug1 and /slug2, both values (slug1 & slug2) still has the same layout /[name]/layout.js
        if (currentTreeSegment[0] !== nextTreeSegment[0] || currentTreeSegment[2] !== nextTreeSegment[2]) {
            return true;
        }
    } else if (currentTreeSegment !== nextTreeSegment) {
        return true;
    }
    // Current tree root layout found
    if (currentTree[4]) {
        // If the next tree doesn't have the root layout flag, it must have changed.
        return !nextTree[4];
    }
    // Current tree  didn't have its root layout here, must have changed.
    if (nextTree[4]) {
        return true;
    }
    // We can't assume it's `parallelRoutes.children` here in case the root layout is `app/@something/layout.js`
    // But it's not possible to be more than one parallelRoutes before the root layout is found
    // TODO-APP: change to traverse all parallel routes
    const currentTreeChild = Object.values(currentTree[1])[0];
    const nextTreeChild = Object.values(nextTree[1])[0];
    if (!currentTreeChild || !nextTreeChild) return true;
    return isNavigatingToNewRootLayout(currentTreeChild, nextTreeChild);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=is-navigating-to-new-root-layout.js.map


/***/ }),

/***/ 40108:
/***/ ((module, exports) => {

"use strict";
/**
 * Read record value or throw Promise if it's not resolved yet.
 */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "readRecordValue", ({
    enumerable: true,
    get: function() {
        return readRecordValue;
    }
}));
function readRecordValue(thenable) {
    // @ts-expect-error TODO: fix type
    if (thenable.status === "fulfilled") {
        // @ts-expect-error TODO: fix type
        return thenable.value;
    } else {
        throw thenable;
    }
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=read-record-value.js.map


/***/ }),

/***/ 74614:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "fastRefreshReducer", ({
    enumerable: true,
    get: function() {
        return fastRefreshReducer;
    }
}));
const _fetchserverresponse = __webpack_require__(64599);
const _createrecordfromthenable = __webpack_require__(79669);
const _readrecordvalue = __webpack_require__(40108);
const _createhreffromurl = __webpack_require__(69897);
const _applyrouterstatepatchtotree = __webpack_require__(68018);
const _isnavigatingtonewrootlayout = __webpack_require__(35991);
const _navigatereducer = __webpack_require__(17252);
const _handlemutable = __webpack_require__(48207);
const _applyflightdata = __webpack_require__(84403);
// A version of refresh reducer that keeps the cache around instead of wiping all of it.
function fastRefreshReducerImpl(state, action) {
    const { cache , mutable , origin  } = action;
    const href = state.canonicalUrl;
    const isForCurrentTree = JSON.stringify(mutable.previousTree) === JSON.stringify(state.tree);
    if (isForCurrentTree) {
        return (0, _handlemutable.handleMutable)(state, mutable);
    }
    if (!cache.data) {
        // TODO-APP: verify that `href` is not an external url.
        // Fetch data from the root of the tree.
        cache.data = (0, _createrecordfromthenable.createRecordFromThenable)((0, _fetchserverresponse.fetchServerResponse)(new URL(href, origin), [
            state.tree[0],
            state.tree[1],
            state.tree[2],
            "refetch"
        ], state.nextUrl));
    }
    const [flightData, canonicalUrlOverride] = (0, _readrecordvalue.readRecordValue)(cache.data);
    // Handle case when navigating to page in `pages` from `app`
    if (typeof flightData === "string") {
        return (0, _navigatereducer.handleExternalUrl)(state, mutable, flightData, state.pushRef.pendingPush);
    }
    // Remove cache.data as it has been resolved at this point.
    cache.data = null;
    let currentTree = state.tree;
    let currentCache = state.cache;
    for (const flightDataPath of flightData){
        // FlightDataPath with more than two items means unexpected Flight data was returned
        if (flightDataPath.length !== 3) {
            // TODO-APP: handle this case better
            console.log("REFRESH FAILED");
            return state;
        }
        // Given the path can only have two items the items are only the router state and subTreeData for the root.
        const [treePatch] = flightDataPath;
        const newTree = (0, _applyrouterstatepatchtotree.applyRouterStatePatchToTree)([
            ""
        ], currentTree, treePatch);
        if (newTree === null) {
            throw new Error("SEGMENT MISMATCH");
        }
        if ((0, _isnavigatingtonewrootlayout.isNavigatingToNewRootLayout)(currentTree, newTree)) {
            return (0, _navigatereducer.handleExternalUrl)(state, mutable, href, state.pushRef.pendingPush);
        }
        const canonicalUrlOverrideHref = canonicalUrlOverride ? (0, _createhreffromurl.createHrefFromUrl)(canonicalUrlOverride) : undefined;
        if (canonicalUrlOverride) {
            mutable.canonicalUrl = canonicalUrlOverrideHref;
        }
        const applied = (0, _applyflightdata.applyFlightData)(currentCache, cache, flightDataPath);
        if (applied) {
            mutable.cache = cache;
            currentCache = cache;
        }
        mutable.previousTree = currentTree;
        mutable.patchedTree = newTree;
        mutable.canonicalUrl = href;
        currentTree = newTree;
    }
    return (0, _handlemutable.handleMutable)(state, mutable);
}
function fastRefreshReducerNoop(state, _action) {
    return state;
}
const fastRefreshReducer =  true ? fastRefreshReducerNoop : 0;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=fast-refresh-reducer.js.map


/***/ }),

/***/ 61058:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "findHeadInCache", ({
    enumerable: true,
    get: function() {
        return findHeadInCache;
    }
}));
const _createroutercachekey = __webpack_require__(48627);
function findHeadInCache(cache, parallelRoutes) {
    const isLastItem = Object.keys(parallelRoutes).length === 0;
    if (isLastItem) {
        return cache.head;
    }
    for(const key in parallelRoutes){
        const [segment, childParallelRoutes] = parallelRoutes[key];
        const childSegmentMap = cache.parallelRoutes.get(key);
        if (!childSegmentMap) {
            continue;
        }
        const cacheKey = (0, _createroutercachekey.createRouterCacheKey)(segment);
        const cacheNode = childSegmentMap.get(cacheKey);
        if (!cacheNode) {
            continue;
        }
        const item = findHeadInCache(cacheNode, childParallelRoutes);
        if (item) {
            return item;
        }
    }
    return undefined;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=find-head-in-cache.js.map


/***/ }),

/***/ 48672:
/***/ ((module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getSegmentValue", ({
    enumerable: true,
    get: function() {
        return getSegmentValue;
    }
}));
function getSegmentValue(segment) {
    return Array.isArray(segment) ? segment[1] : segment;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=get-segment-value.js.map


/***/ }),

/***/ 17252:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

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
    handleExternalUrl: function() {
        return handleExternalUrl;
    },
    navigateReducer: function() {
        return navigateReducer;
    }
});
const _approutercontext = __webpack_require__(3280);
const _fetchserverresponse = __webpack_require__(64599);
const _createrecordfromthenable = __webpack_require__(79669);
const _readrecordvalue = __webpack_require__(40108);
const _createhreffromurl = __webpack_require__(69897);
const _invalidatecachebelowflightsegmentpath = __webpack_require__(39337);
const _fillcachewithdataproperty = __webpack_require__(23514);
const _createoptimistictree = __webpack_require__(27120);
const _applyrouterstatepatchtotree = __webpack_require__(68018);
const _shouldhardnavigate = __webpack_require__(30190);
const _isnavigatingtonewrootlayout = __webpack_require__(35991);
const _routerreducertypes = __webpack_require__(40664);
const _handlemutable = __webpack_require__(48207);
const _applyflightdata = __webpack_require__(84403);
const _getprefetchcacheentrystatus = __webpack_require__(21447);
const _pruneprefetchcache = __webpack_require__(56014);
function handleExternalUrl(state, mutable, url, pendingPush) {
    mutable.previousTree = state.tree;
    mutable.mpaNavigation = true;
    mutable.canonicalUrl = url;
    mutable.pendingPush = pendingPush;
    mutable.scrollableSegments = undefined;
    return (0, _handlemutable.handleMutable)(state, mutable);
}
function generateSegmentsFromPatch(flightRouterPatch) {
    const segments = [];
    const [segment, parallelRoutes] = flightRouterPatch;
    if (Object.keys(parallelRoutes).length === 0) {
        return [
            [
                segment
            ]
        ];
    }
    for (const [parallelRouteKey, parallelRoute] of Object.entries(parallelRoutes)){
        for (const childSegment of generateSegmentsFromPatch(parallelRoute)){
            // If the segment is empty, it means we are at the root of the tree
            if (segment === "") {
                segments.push([
                    parallelRouteKey,
                    ...childSegment
                ]);
            } else {
                segments.push([
                    segment,
                    parallelRouteKey,
                    ...childSegment
                ]);
            }
        }
    }
    return segments;
}
function addRefetchToLeafSegments(newCache, currentCache, flightSegmentPath, treePatch, data) {
    let appliedPatch = false;
    newCache.status = _approutercontext.CacheStates.READY;
    newCache.subTreeData = currentCache.subTreeData;
    newCache.parallelRoutes = new Map(currentCache.parallelRoutes);
    const segmentPathsToFill = generateSegmentsFromPatch(treePatch).map((segment)=>[
            ...flightSegmentPath,
            ...segment
        ]);
    for (const segmentPaths of segmentPathsToFill){
        const res = (0, _fillcachewithdataproperty.fillCacheWithDataProperty)(newCache, currentCache, segmentPaths, data);
        if (!(res == null ? void 0 : res.bailOptimistic)) {
            appliedPatch = true;
        }
    }
    return appliedPatch;
}
function navigateReducer(state, action) {
    const { url , isExternalUrl , navigateType , cache , mutable , forceOptimisticNavigation  } = action;
    const { pathname , hash  } = url;
    const href = (0, _createhreffromurl.createHrefFromUrl)(url);
    const pendingPush = navigateType === "push";
    // we want to prune the prefetch cache on every navigation to avoid it growing too large
    (0, _pruneprefetchcache.prunePrefetchCache)(state.prefetchCache);
    const isForCurrentTree = JSON.stringify(mutable.previousTree) === JSON.stringify(state.tree);
    if (isForCurrentTree) {
        return (0, _handlemutable.handleMutable)(state, mutable);
    }
    if (isExternalUrl) {
        return handleExternalUrl(state, mutable, url.toString(), pendingPush);
    }
    let prefetchValues = state.prefetchCache.get((0, _createhreffromurl.createHrefFromUrl)(url, false));
    if (forceOptimisticNavigation && (prefetchValues == null ? void 0 : prefetchValues.kind) !== _routerreducertypes.PrefetchKind.TEMPORARY) {
        const segments = pathname.split("/");
        // TODO-APP: figure out something better for index pages
        segments.push("");
        // Optimistic tree case.
        // If the optimistic tree is deeper than the current state leave that deeper part out of the fetch
        const optimisticTree = (0, _createoptimistictree.createOptimisticTree)(segments, state.tree, false);
        // we need a copy of the cache in case we need to revert to it
        const temporaryCacheNode = {
            ...cache
        };
        // Copy subTreeData for the root node of the cache.
        // Note: didn't do it above because typescript doesn't like it.
        temporaryCacheNode.status = _approutercontext.CacheStates.READY;
        temporaryCacheNode.subTreeData = state.cache.subTreeData;
        temporaryCacheNode.parallelRoutes = new Map(state.cache.parallelRoutes);
        const data = (0, _createrecordfromthenable.createRecordFromThenable)((0, _fetchserverresponse.fetchServerResponse)(url, optimisticTree, state.nextUrl));
        // TODO-APP: segments.slice(1) strips '', we can get rid of '' altogether.
        // TODO-APP: re-evaluate if we need to strip the last segment
        const optimisticFlightSegmentPath = segments.slice(1).map((segment)=>[
                "children",
                segment === "" ? "__PAGE__" : segment
            ]).flat();
        // Copy existing cache nodes as far as possible and fill in `data` property with the started data fetch.
        // The `data` property is used to suspend in layout-router during render if it hasn't resolved yet by the time it renders.
        const res = (0, _fillcachewithdataproperty.fillCacheWithDataProperty)(temporaryCacheNode, state.cache, optimisticFlightSegmentPath, ()=>data, true);
        // If optimistic fetch couldn't happen it falls back to the non-optimistic case.
        if (!(res == null ? void 0 : res.bailOptimistic)) {
            mutable.previousTree = state.tree;
            mutable.patchedTree = optimisticTree;
            mutable.pendingPush = pendingPush;
            mutable.hashFragment = hash;
            mutable.scrollableSegments = [];
            mutable.cache = temporaryCacheNode;
            mutable.canonicalUrl = href;
            state.prefetchCache.set((0, _createhreffromurl.createHrefFromUrl)(url, false), {
                data: Promise.resolve(data),
                // this will make sure that the entry will be discarded after 30s
                kind: _routerreducertypes.PrefetchKind.TEMPORARY,
                prefetchTime: Date.now(),
                treeAtTimeOfPrefetch: state.tree,
                lastUsedTime: Date.now()
            });
            return (0, _handlemutable.handleMutable)(state, mutable);
        }
    }
    // If we don't have a prefetch value, we need to create one
    if (!prefetchValues) {
        const data = (0, _createrecordfromthenable.createRecordFromThenable)((0, _fetchserverresponse.fetchServerResponse)(url, state.tree, state.nextUrl));
        const newPrefetchValue = {
            data: Promise.resolve(data),
            // this will make sure that the entry will be discarded after 30s
            kind: _routerreducertypes.PrefetchKind.TEMPORARY,
            prefetchTime: Date.now(),
            treeAtTimeOfPrefetch: state.tree,
            lastUsedTime: null
        };
        state.prefetchCache.set((0, _createhreffromurl.createHrefFromUrl)(url, false), newPrefetchValue);
        prefetchValues = newPrefetchValue;
    }
    const prefetchEntryCacheStatus = (0, _getprefetchcacheentrystatus.getPrefetchEntryCacheStatus)(prefetchValues);
    // The one before last item is the router state tree patch
    const { treeAtTimeOfPrefetch , data  } = prefetchValues;
    // Unwrap cache data with `use` to suspend here (in the reducer) until the fetch resolves.
    const [flightData, canonicalUrlOverride] = (0, _readrecordvalue.readRecordValue)(data);
    // important: we should only mark the cache node as dirty after we unsuspend from the call above
    prefetchValues.lastUsedTime = Date.now();
    // Handle case when navigating to page in `pages` from `app`
    if (typeof flightData === "string") {
        return handleExternalUrl(state, mutable, flightData, pendingPush);
    }
    let currentTree = state.tree;
    let currentCache = state.cache;
    let scrollableSegments = [];
    for (const flightDataPath of flightData){
        const flightSegmentPath = flightDataPath.slice(0, -4);
        // The one before last item is the router state tree patch
        const [treePatch] = flightDataPath.slice(-3);
        // Create new tree based on the flightSegmentPath and router state patch
        let newTree = (0, _applyrouterstatepatchtotree.applyRouterStatePatchToTree)([
            "",
            ...flightSegmentPath
        ], currentTree, treePatch);
        // If the tree patch can't be applied to the current tree then we use the tree at time of prefetch
        // TODO-APP: This should instead fill in the missing pieces in `currentTree` with the data from `treeAtTimeOfPrefetch`, then apply the patch.
        if (newTree === null) {
            newTree = (0, _applyrouterstatepatchtotree.applyRouterStatePatchToTree)([
                "",
                ...flightSegmentPath
            ], treeAtTimeOfPrefetch, treePatch);
        }
        if (newTree !== null) {
            if ((0, _isnavigatingtonewrootlayout.isNavigatingToNewRootLayout)(currentTree, newTree)) {
                return handleExternalUrl(state, mutable, href, pendingPush);
            }
            let applied = (0, _applyflightdata.applyFlightData)(currentCache, cache, flightDataPath, prefetchValues.kind === "auto" && prefetchEntryCacheStatus === _getprefetchcacheentrystatus.PrefetchCacheEntryStatus.reusable);
            if (!applied && prefetchEntryCacheStatus === _getprefetchcacheentrystatus.PrefetchCacheEntryStatus.stale) {
                applied = addRefetchToLeafSegments(cache, currentCache, flightSegmentPath, treePatch, ()=>(0, _fetchserverresponse.fetchServerResponse)(url, newTree, state.nextUrl));
            }
            const hardNavigate = (0, _shouldhardnavigate.shouldHardNavigate)([
                "",
                ...flightSegmentPath
            ], currentTree);
            if (hardNavigate) {
                cache.status = _approutercontext.CacheStates.READY;
                // Copy subTreeData for the root node of the cache.
                cache.subTreeData = currentCache.subTreeData;
                (0, _invalidatecachebelowflightsegmentpath.invalidateCacheBelowFlightSegmentPath)(cache, currentCache, flightSegmentPath);
                // Ensure the existing cache value is used when the cache was not invalidated.
                mutable.cache = cache;
            } else if (applied) {
                mutable.cache = cache;
            }
            currentCache = cache;
            currentTree = newTree;
            for (const subSegment of generateSegmentsFromPatch(treePatch)){
                const scrollableSegmentPath = [
                    ...flightSegmentPath,
                    ...subSegment
                ];
                // Filter out the __DEFAULT__ paths as they shouldn't be scrolled to in this case.
                if (scrollableSegmentPath[scrollableSegmentPath.length - 1] !== "__DEFAULT__") {
                    scrollableSegments.push(scrollableSegmentPath);
                }
            }
        }
    }
    mutable.previousTree = state.tree;
    mutable.patchedTree = currentTree;
    mutable.scrollableSegments = scrollableSegments;
    mutable.canonicalUrl = canonicalUrlOverride ? (0, _createhreffromurl.createHrefFromUrl)(canonicalUrlOverride) : href;
    mutable.pendingPush = pendingPush;
    mutable.hashFragment = hash;
    return (0, _handlemutable.handleMutable)(state, mutable);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=navigate-reducer.js.map


/***/ }),

/***/ 85274:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "prefetchReducer", ({
    enumerable: true,
    get: function() {
        return prefetchReducer;
    }
}));
const _createhreffromurl = __webpack_require__(69897);
const _fetchserverresponse = __webpack_require__(64599);
const _routerreducertypes = __webpack_require__(40664);
const _createrecordfromthenable = __webpack_require__(79669);
const _pruneprefetchcache = __webpack_require__(56014);
function prefetchReducer(state, action) {
    // let's prune the prefetch cache before we do anything else
    (0, _pruneprefetchcache.prunePrefetchCache)(state.prefetchCache);
    const { url  } = action;
    const href = (0, _createhreffromurl.createHrefFromUrl)(url, false);
    const cacheEntry = state.prefetchCache.get(href);
    if (cacheEntry) {
        /**
     * If the cache entry present was marked as temporary, it means that we prefetched it from the navigate reducer,
     * where we didn't have the prefetch intent. We want to update it to the new, more accurate, kind here.
     */ if (cacheEntry.kind === _routerreducertypes.PrefetchKind.TEMPORARY) {
            state.prefetchCache.set(href, {
                ...cacheEntry,
                kind: action.kind
            });
        }
        /**
     * if the prefetch action was a full prefetch and that the current cache entry wasn't one, we want to re-prefetch,
     * otherwise we can re-use the current cache entry
     **/ if (!(cacheEntry.kind === _routerreducertypes.PrefetchKind.AUTO && action.kind === _routerreducertypes.PrefetchKind.FULL)) {
            return state;
        }
    }
    // fetchServerResponse is intentionally not awaited so that it can be unwrapped in the navigate-reducer
    const serverResponse = (0, _createrecordfromthenable.createRecordFromThenable)((0, _fetchserverresponse.fetchServerResponse)(url, state.tree, state.nextUrl, action.kind));
    // Create new tree based on the flightSegmentPath and router state patch
    state.prefetchCache.set(href, {
        // Create new tree based on the flightSegmentPath and router state patch
        treeAtTimeOfPrefetch: state.tree,
        data: serverResponse,
        kind: action.kind,
        prefetchTime: Date.now(),
        lastUsedTime: null
    });
    return state;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=prefetch-reducer.js.map


/***/ }),

/***/ 56014:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "prunePrefetchCache", ({
    enumerable: true,
    get: function() {
        return prunePrefetchCache;
    }
}));
const _getprefetchcacheentrystatus = __webpack_require__(21447);
function prunePrefetchCache(prefetchCache) {
    for (const [href, prefetchCacheEntry] of prefetchCache){
        if ((0, _getprefetchcacheentrystatus.getPrefetchEntryCacheStatus)(prefetchCacheEntry) === _getprefetchcacheentrystatus.PrefetchCacheEntryStatus.expired) {
            prefetchCache.delete(href);
        }
    }
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=prune-prefetch-cache.js.map


/***/ }),

/***/ 12432:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "refreshReducer", ({
    enumerable: true,
    get: function() {
        return refreshReducer;
    }
}));
const _fetchserverresponse = __webpack_require__(64599);
const _createrecordfromthenable = __webpack_require__(79669);
const _readrecordvalue = __webpack_require__(40108);
const _createhreffromurl = __webpack_require__(69897);
const _applyrouterstatepatchtotree = __webpack_require__(68018);
const _isnavigatingtonewrootlayout = __webpack_require__(35991);
const _navigatereducer = __webpack_require__(17252);
const _handlemutable = __webpack_require__(48207);
const _approutercontext = __webpack_require__(3280);
const _filllazyitemstillleafwithhead = __webpack_require__(82494);
function refreshReducer(state, action) {
    const { cache , mutable , origin  } = action;
    const href = state.canonicalUrl;
    const isForCurrentTree = JSON.stringify(mutable.previousTree) === JSON.stringify(state.tree);
    if (isForCurrentTree) {
        return (0, _handlemutable.handleMutable)(state, mutable);
    }
    if (!cache.data) {
        // TODO-APP: verify that `href` is not an external url.
        // Fetch data from the root of the tree.
        cache.data = (0, _createrecordfromthenable.createRecordFromThenable)((0, _fetchserverresponse.fetchServerResponse)(new URL(href, origin), [
            state.tree[0],
            state.tree[1],
            state.tree[2],
            "refetch"
        ], state.nextUrl));
    }
    const [flightData, canonicalUrlOverride] = (0, _readrecordvalue.readRecordValue)(cache.data);
    // Handle case when navigating to page in `pages` from `app`
    if (typeof flightData === "string") {
        return (0, _navigatereducer.handleExternalUrl)(state, mutable, flightData, state.pushRef.pendingPush);
    }
    // Remove cache.data as it has been resolved at this point.
    cache.data = null;
    let currentTree = state.tree;
    for (const flightDataPath of flightData){
        // FlightDataPath with more than two items means unexpected Flight data was returned
        if (flightDataPath.length !== 3) {
            // TODO-APP: handle this case better
            console.log("REFRESH FAILED");
            return state;
        }
        // Given the path can only have two items the items are only the router state and subTreeData for the root.
        const [treePatch] = flightDataPath;
        const newTree = (0, _applyrouterstatepatchtotree.applyRouterStatePatchToTree)([
            ""
        ], currentTree, treePatch);
        if (newTree === null) {
            throw new Error("SEGMENT MISMATCH");
        }
        if ((0, _isnavigatingtonewrootlayout.isNavigatingToNewRootLayout)(currentTree, newTree)) {
            return (0, _navigatereducer.handleExternalUrl)(state, mutable, href, state.pushRef.pendingPush);
        }
        const canonicalUrlOverrideHref = canonicalUrlOverride ? (0, _createhreffromurl.createHrefFromUrl)(canonicalUrlOverride) : undefined;
        if (canonicalUrlOverride) {
            mutable.canonicalUrl = canonicalUrlOverrideHref;
        }
        // The one before last item is the router state tree patch
        const [subTreeData, head] = flightDataPath.slice(-2);
        // Handles case where prefetch only returns the router tree patch without rendered components.
        if (subTreeData !== null) {
            cache.status = _approutercontext.CacheStates.READY;
            cache.subTreeData = subTreeData;
            (0, _filllazyitemstillleafwithhead.fillLazyItemsTillLeafWithHead)(cache, undefined, treePatch, head);
            mutable.cache = cache;
            mutable.prefetchCache = new Map();
        }
        mutable.previousTree = currentTree;
        mutable.patchedTree = newTree;
        mutable.canonicalUrl = href;
        currentTree = newTree;
    }
    return (0, _handlemutable.handleMutable)(state, mutable);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=refresh-reducer.js.map


/***/ }),

/***/ 62796:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "restoreReducer", ({
    enumerable: true,
    get: function() {
        return restoreReducer;
    }
}));
const _createhreffromurl = __webpack_require__(69897);
function restoreReducer(state, action) {
    const { url , tree  } = action;
    const href = (0, _createhreffromurl.createHrefFromUrl)(url);
    return {
        // Set canonical url
        canonicalUrl: href,
        pushRef: state.pushRef,
        focusAndScrollRef: state.focusAndScrollRef,
        cache: state.cache,
        prefetchCache: state.prefetchCache,
        // Restore provided tree
        tree: tree,
        nextUrl: url.pathname
    };
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=restore-reducer.js.map


/***/ }),

/***/ 85686:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "serverPatchReducer", ({
    enumerable: true,
    get: function() {
        return serverPatchReducer;
    }
}));
const _createhreffromurl = __webpack_require__(69897);
const _applyrouterstatepatchtotree = __webpack_require__(68018);
const _isnavigatingtonewrootlayout = __webpack_require__(35991);
const _navigatereducer = __webpack_require__(17252);
const _applyflightdata = __webpack_require__(84403);
const _handlemutable = __webpack_require__(48207);
function serverPatchReducer(state, action) {
    const { flightData , previousTree , overrideCanonicalUrl , cache , mutable  } = action;
    const isForCurrentTree = JSON.stringify(previousTree) === JSON.stringify(state.tree);
    // When a fetch is slow to resolve it could be that you navigated away while the request was happening or before the reducer runs.
    // In that case opt-out of applying the patch given that the data could be stale.
    if (!isForCurrentTree) {
        // TODO-APP: Handle tree mismatch
        console.log("TREE MISMATCH");
        // Keep everything as-is.
        return state;
    }
    if (mutable.previousTree) {
        return (0, _handlemutable.handleMutable)(state, mutable);
    }
    // Handle case when navigating to page in `pages` from `app`
    if (typeof flightData === "string") {
        return (0, _navigatereducer.handleExternalUrl)(state, mutable, flightData, state.pushRef.pendingPush);
    }
    let currentTree = state.tree;
    let currentCache = state.cache;
    for (const flightDataPath of flightData){
        // Slices off the last segment (which is at -4) as it doesn't exist in the tree yet
        const flightSegmentPath = flightDataPath.slice(0, -4);
        const [treePatch] = flightDataPath.slice(-3, -2);
        const newTree = (0, _applyrouterstatepatchtotree.applyRouterStatePatchToTree)([
            "",
            ...flightSegmentPath
        ], currentTree, treePatch);
        if (newTree === null) {
            throw new Error("SEGMENT MISMATCH");
        }
        if ((0, _isnavigatingtonewrootlayout.isNavigatingToNewRootLayout)(currentTree, newTree)) {
            return (0, _navigatereducer.handleExternalUrl)(state, mutable, state.canonicalUrl, state.pushRef.pendingPush);
        }
        const canonicalUrlOverrideHref = overrideCanonicalUrl ? (0, _createhreffromurl.createHrefFromUrl)(overrideCanonicalUrl) : undefined;
        if (canonicalUrlOverrideHref) {
            mutable.canonicalUrl = canonicalUrlOverrideHref;
        }
        (0, _applyflightdata.applyFlightData)(currentCache, cache, flightDataPath);
        mutable.previousTree = currentTree;
        mutable.patchedTree = newTree;
        mutable.cache = cache;
        currentCache = cache;
        currentTree = newTree;
    }
    return (0, _handlemutable.handleMutable)(state, mutable);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=server-patch-reducer.js.map


/***/ }),

/***/ 40664:
/***/ ((module, exports) => {

"use strict";

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
    PrefetchKind: function() {
        return PrefetchKind;
    },
    ACTION_REFRESH: function() {
        return ACTION_REFRESH;
    },
    ACTION_NAVIGATE: function() {
        return ACTION_NAVIGATE;
    },
    ACTION_RESTORE: function() {
        return ACTION_RESTORE;
    },
    ACTION_SERVER_PATCH: function() {
        return ACTION_SERVER_PATCH;
    },
    ACTION_PREFETCH: function() {
        return ACTION_PREFETCH;
    },
    ACTION_FAST_REFRESH: function() {
        return ACTION_FAST_REFRESH;
    }
});
const ACTION_REFRESH = "refresh";
const ACTION_NAVIGATE = "navigate";
const ACTION_RESTORE = "restore";
const ACTION_SERVER_PATCH = "server-patch";
const ACTION_PREFETCH = "prefetch";
const ACTION_FAST_REFRESH = "fast-refresh";
var PrefetchKind;
(function(PrefetchKind) {
    PrefetchKind["AUTO"] = "auto";
    PrefetchKind["FULL"] = "full";
    PrefetchKind["TEMPORARY"] = "temporary";
})(PrefetchKind || (PrefetchKind = {}));
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=router-reducer-types.js.map


/***/ }),

/***/ 60542:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "reducer", ({
    enumerable: true,
    get: function() {
        return reducer;
    }
}));
const _routerreducertypes = __webpack_require__(40664);
const _navigatereducer = __webpack_require__(17252);
const _serverpatchreducer = __webpack_require__(85686);
const _restorereducer = __webpack_require__(62796);
const _refreshreducer = __webpack_require__(12432);
const _prefetchreducer = __webpack_require__(85274);
const _fastrefreshreducer = __webpack_require__(74614);
/**
 * Reducer that handles the app-router state updates.
 */ function clientReducer(state, action) {
    switch(action.type){
        case _routerreducertypes.ACTION_NAVIGATE:
            {
                return (0, _navigatereducer.navigateReducer)(state, action);
            }
        case _routerreducertypes.ACTION_SERVER_PATCH:
            {
                return (0, _serverpatchreducer.serverPatchReducer)(state, action);
            }
        case _routerreducertypes.ACTION_RESTORE:
            {
                return (0, _restorereducer.restoreReducer)(state, action);
            }
        case _routerreducertypes.ACTION_REFRESH:
            {
                return (0, _refreshreducer.refreshReducer)(state, action);
            }
        case _routerreducertypes.ACTION_FAST_REFRESH:
            {
                return (0, _fastrefreshreducer.fastRefreshReducer)(state, action);
            }
        case _routerreducertypes.ACTION_PREFETCH:
            {
                return (0, _prefetchreducer.prefetchReducer)(state, action);
            }
        // This case should never be hit as dispatch is strongly typed.
        default:
            throw new Error("Unknown action");
    }
}
function serverReducer(state, _action) {
    return state;
}
const reducer =  true ? serverReducer : 0;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=router-reducer.js.map


/***/ }),

/***/ 30190:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "shouldHardNavigate", ({
    enumerable: true,
    get: function() {
        return shouldHardNavigate;
    }
}));
const _matchsegments = __webpack_require__(28226);
function shouldHardNavigate(flightSegmentPath, flightRouterState) {
    const [segment, parallelRoutes] = flightRouterState;
    // TODO-APP: Check if `as` can be replaced.
    const [currentSegment, parallelRouteKey] = flightSegmentPath;
    // Check if current segment matches the existing segment.
    if (!(0, _matchsegments.matchSegment)(currentSegment, segment)) {
        // If dynamic parameter in tree doesn't match up with segment path a hard navigation is triggered.
        if (Array.isArray(currentSegment)) {
            return true;
        }
        // If the existing segment did not match soft navigation is triggered.
        return false;
    }
    const lastSegment = flightSegmentPath.length <= 2;
    if (lastSegment) {
        return false;
    }
    return shouldHardNavigate(flightSegmentPath.slice(2), parallelRoutes[parallelRouteKey]);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=should-hard-navigate.js.map


/***/ }),

/***/ 51194:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "createSearchParamsBailoutProxy", ({
    enumerable: true,
    get: function() {
        return createSearchParamsBailoutProxy;
    }
}));
const _staticgenerationbailout = __webpack_require__(87866);
function createSearchParamsBailoutProxy() {
    return new Proxy({}, {
        get (_target, prop) {
            // React adds some properties on the object when serializing for client components
            if (typeof prop === "string") {
                (0, _staticgenerationbailout.staticGenerationBailout)("searchParams." + prop);
            }
        }
    });
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=searchparams-bailout-proxy.js.map


/***/ }),

/***/ 87866:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "staticGenerationBailout", ({
    enumerable: true,
    get: function() {
        return staticGenerationBailout;
    }
}));
const _hooksservercontext = __webpack_require__(65404);
const _staticgenerationasyncstorage = __webpack_require__(1839);
class StaticGenBailoutError extends Error {
    constructor(...args){
        super(...args);
        this.code = "NEXT_STATIC_GEN_BAILOUT";
    }
}
const staticGenerationBailout = (reason, opts)=>{
    const staticGenerationStore = _staticgenerationasyncstorage.staticGenerationAsyncStorage.getStore();
    if (staticGenerationStore == null ? void 0 : staticGenerationStore.forceStatic) {
        return true;
    }
    if (staticGenerationStore == null ? void 0 : staticGenerationStore.dynamicShouldError) {
        const { dynamic ="error" , link  } = opts || {};
        const suffix = link ? " See more info here: " + link : "";
        throw new StaticGenBailoutError('Page with `dynamic = "' + dynamic + "\"` couldn't be rendered statically because it used `" + reason + "`." + suffix);
    }
    if (staticGenerationStore) {
        staticGenerationStore.revalidate = 0;
    }
    if (staticGenerationStore == null ? void 0 : staticGenerationStore.isStaticGeneration) {
        const err = new _hooksservercontext.DynamicServerError(reason);
        staticGenerationStore.dynamicUsageDescription = reason;
        staticGenerationStore.dynamicUsageStack = err.stack;
        throw err;
    }
    return false;
};
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=static-generation-bailout.js.map


/***/ }),

/***/ 5192:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* __next_internal_client_entry_do_not_use__  cjs */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "default", ({
    enumerable: true,
    get: function() {
        return StaticGenerationSearchParamsBailoutProvider;
    }
}));
const _interop_require_default = __webpack_require__(95967);
const _react = /*#__PURE__*/ _interop_require_default._(__webpack_require__(18038));
const _searchparamsbailoutproxy = __webpack_require__(51194);
function StaticGenerationSearchParamsBailoutProvider(param) {
    let { Component , propsForComponent  } = param;
    const searchParams = (0, _searchparamsbailoutproxy.createSearchParamsBailoutProxy)();
    return /*#__PURE__*/ _react.default.createElement(Component, {
        searchParams: searchParams,
        ...propsForComponent
    });
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=static-generation-searchparams-bailout-provider.js.map


/***/ }),

/***/ 46958:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "useReducerWithReduxDevtools", ({
    enumerable: true,
    get: function() {
        return useReducerWithReduxDevtools;
    }
}));
const _react = __webpack_require__(18038);
function normalizeRouterState(val) {
    if (val instanceof Map) {
        const obj = {};
        for (const [key, value] of val.entries()){
            if (typeof value === "function") {
                obj[key] = "fn()";
                continue;
            }
            if (typeof value === "object" && value !== null) {
                if (value.$$typeof) {
                    obj[key] = value.$$typeof.toString();
                    continue;
                }
                if (value._bundlerConfig) {
                    obj[key] = "FlightData";
                    continue;
                }
            }
            obj[key] = normalizeRouterState(value);
        }
        return obj;
    }
    if (typeof val === "object" && val !== null) {
        const obj = {};
        for(const key in val){
            const value = val[key];
            if (typeof value === "function") {
                obj[key] = "fn()";
                continue;
            }
            if (typeof value === "object" && value !== null) {
                if (value.$$typeof) {
                    obj[key] = value.$$typeof.toString();
                    continue;
                }
                if (value.hasOwnProperty("_bundlerConfig")) {
                    obj[key] = "FlightData";
                    continue;
                }
            }
            obj[key] = normalizeRouterState(value);
        }
        return obj;
    }
    if (Array.isArray(val)) {
        return val.map(normalizeRouterState);
    }
    return val;
}
function devToolReducer(fn, ref) {
    return (state, action)=>{
        const res = fn(state, action);
        if (ref.current) {
            ref.current.send(action, normalizeRouterState(res));
        }
        return res;
    };
}
function useReducerWithReduxDevtoolsNoop(fn, initialState) {
    const [state, dispatch] = (0, _react.useReducer)(fn, initialState);
    return [
        state,
        dispatch,
        ()=>{}
    ];
}
function useReducerWithReduxDevtoolsImpl(fn, initialState) {
    const devtoolsConnectionRef = (0, _react.useRef)();
    const enabledRef = (0, _react.useRef)();
    (0, _react.useEffect)(()=>{
        if (devtoolsConnectionRef.current || enabledRef.current === false) {
            return;
        }
        if (enabledRef.current === undefined && typeof window.__REDUX_DEVTOOLS_EXTENSION__ === "undefined") {
            enabledRef.current = false;
            return;
        }
        devtoolsConnectionRef.current = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
            instanceId: 8000,
            name: "next-router"
        });
        if (devtoolsConnectionRef.current) {
            devtoolsConnectionRef.current.init(normalizeRouterState(initialState));
        }
        return ()=>{
            devtoolsConnectionRef.current = undefined;
        };
    }, [
        initialState
    ]);
    const [state, dispatch] = (0, _react.useReducer)(devToolReducer(/* logReducer( */ fn /*)*/ , devtoolsConnectionRef), initialState);
    const sync = (0, _react.useCallback)(()=>{
        if (devtoolsConnectionRef.current) {
            devtoolsConnectionRef.current.send({
                type: "RENDER_SYNC"
            }, normalizeRouterState(state));
        }
    }, [
        state
    ]);
    return [
        state,
        dispatch,
        sync
    ];
}
const useReducerWithReduxDevtools =  false ? 0 : useReducerWithReduxDevtoolsNoop;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=use-reducer-with-devtools.js.map


/***/ }),

/***/ 18115:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "normalizePathTrailingSlash", ({
    enumerable: true,
    get: function() {
        return normalizePathTrailingSlash;
    }
}));
const _removetrailingslash = __webpack_require__(93297);
const _parsepath = __webpack_require__(28854);
const normalizePathTrailingSlash = (path)=>{
    if (!path.startsWith("/") || undefined) {
        return path;
    }
    const { pathname , query , hash  } = (0, _parsepath.parsePath)(path);
    if (false) {}
    return "" + (0, _removetrailingslash.removeTrailingSlash)(pathname) + query + hash;
};
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=normalize-trailing-slash.js.map


/***/ }),

/***/ 92144:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* __next_internal_client_entry_do_not_use__  cjs */ 
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
    suspense: function() {
        return suspense;
    },
    NoSSR: function() {
        return NoSSR;
    }
});
const _interop_require_default = __webpack_require__(95967);
const _react = /*#__PURE__*/ _interop_require_default._(__webpack_require__(18038));
const _nossrerror = __webpack_require__(60561);
function suspense() {
    const error = new Error(_nossrerror.NEXT_DYNAMIC_NO_SSR_CODE);
    error.digest = _nossrerror.NEXT_DYNAMIC_NO_SSR_CODE;
    throw error;
}
function NoSSR(param) {
    let { children  } = param;
    if (true) {
        suspense();
    }
    return children;
} //# sourceMappingURL=dynamic-no-ssr.js.map


/***/ }),

/***/ 60561:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
// This has to be a shared module which is shared between client component error boundary and dynamic component

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "NEXT_DYNAMIC_NO_SSR_CODE", ({
    enumerable: true,
    get: function() {
        return NEXT_DYNAMIC_NO_SSR_CODE;
    }
}));
const NEXT_DYNAMIC_NO_SSR_CODE = "DYNAMIC_SERVER_USAGE"; //# sourceMappingURL=no-ssr-error.js.map


/***/ }),

/***/ 35985:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ // Modified from https://github.com/facebook/react/blob/main/packages/react-server-dom-webpack/src/ReactFlightWebpackNodeRegister.js

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "createProxy", ({
    enumerable: true,
    get: function() {
        return createProxy;
    }
}));
const CLIENT_REFERENCE = Symbol.for("react.client.reference");
const PROMISE_PROTOTYPE = Promise.prototype;
const deepProxyHandlers = {
    get: function(target, name, _receiver) {
        switch(name){
            // These names are read by the Flight runtime if you end up using the exports object.
            case "$$typeof":
                // These names are a little too common. We should probably have a way to
                // have the Flight runtime extract the inner target instead.
                return target.$$typeof;
            case "$$id":
                return target.$$id;
            case "$$async":
                return target.$$async;
            case "name":
                return target.name;
            case "displayName":
                return undefined;
            // We need to special case this because createElement reads it if we pass this
            // reference.
            case "defaultProps":
                return undefined;
            // Avoid this attempting to be serialized.
            case "toJSON":
                return undefined;
            case Symbol.toPrimitive.toString():
                // @ts-ignore
                return Object.prototype[Symbol.toPrimitive];
            case "Provider":
                throw new Error(`Cannot render a Client Context Provider on the Server. ` + `Instead, you can export a Client Component wrapper ` + `that itself renders a Client Context Provider.`);
            default:
                break;
        }
        const expression = String(target.name) + "." + String(name);
        throw new Error(`Cannot access ${expression} on the server. ` + "You cannot dot into a client module from a server component. " + "You can only pass the imported name through.");
    },
    set: function() {
        throw new Error("Cannot assign to a client module from a server module.");
    }
};
const proxyHandlers = {
    get: function(target, name, _receiver) {
        switch(name){
            // These names are read by the Flight runtime if you end up using the exports object.
            case "$$typeof":
                return target.$$typeof;
            case "$$id":
                return target.$$id;
            case "$$async":
                return target.$$async;
            case "name":
                return target.name;
            // We need to special case this because createElement reads it if we pass this
            // reference.
            case "defaultProps":
                return undefined;
            // Avoid this attempting to be serialized.
            case "toJSON":
                return undefined;
            case Symbol.toPrimitive.toString():
                // @ts-ignore
                return Object.prototype[Symbol.toPrimitive];
            case "__esModule":
                // Something is conditionally checking which export to use. We'll pretend to be
                // an ESM compat module but then we'll check again on the client.
                const moduleId = target.$$id;
                target.default = Object.defineProperties(function() {
                    throw new Error(`Attempted to call the default export of ${moduleId} from the server ` + `but it's on the client. It's not possible to invoke a client function from ` + `the server, it can only be rendered as a Component or passed to props of a ` + `Client Component.`);
                }, {
                    $$typeof: {
                        value: CLIENT_REFERENCE
                    },
                    // This a placeholder value that tells the client to conditionally use the
                    // whole object or just the default export.
                    $$id: {
                        value: target.$$id + "#"
                    },
                    $$async: {
                        value: target.$$async
                    }
                });
                return true;
            case "then":
                if (target.then) {
                    // Use a cached value
                    return target.then;
                }
                if (!target.$$async) {
                    // If this module is expected to return a Promise (such as an AsyncModule) then
                    // we should resolve that with a client reference that unwraps the Promise on
                    // the client.
                    const clientReference = Object.defineProperties({}, {
                        $$typeof: {
                            value: CLIENT_REFERENCE
                        },
                        $$id: {
                            value: target.$$id
                        },
                        $$async: {
                            value: true
                        }
                    });
                    const proxy = new Proxy(clientReference, proxyHandlers);
                    // Treat this as a resolved Promise for React's use()
                    target.status = "fulfilled";
                    target.value = proxy;
                    const then = target.then = Object.defineProperties(function then(resolve, _reject) {
                        // Expose to React.
                        return Promise.resolve(resolve(proxy));
                    }, // export then we should treat it as a reference to that name.
                    {
                        $$typeof: {
                            value: CLIENT_REFERENCE
                        },
                        $$id: {
                            value: target.$$id
                        },
                        $$async: {
                            value: false
                        }
                    });
                    return then;
                } else {
                    // Since typeof .then === 'function' is a feature test we'd continue recursing
                    // indefinitely if we return a function. Instead, we return an object reference
                    // if we check further.
                    return undefined;
                }
            default:
                break;
        }
        let cachedReference = target[name];
        if (!cachedReference) {
            const reference = Object.defineProperties(function() {
                throw new Error(`Attempted to call ${String(name)}() from the server but ${String(name)} is on the client. ` + `It's not possible to invoke a client function from the server, it can ` + `only be rendered as a Component or passed to props of a Client Component.`);
            }, {
                $$typeof: {
                    value: CLIENT_REFERENCE
                },
                $$id: {
                    value: target.$$id + "#" + name
                },
                $$async: {
                    value: target.$$async
                }
            });
            cachedReference = target[name] = new Proxy(reference, deepProxyHandlers);
        }
        return cachedReference;
    },
    getPrototypeOf (_target) {
        // Pretend to be a Promise in case anyone asks.
        return PROMISE_PROTOTYPE;
    },
    set: function() {
        throw new Error("Cannot assign to a client module from a server module.");
    }
};
function createProxy(moduleId) {
    const clientReference = Object.defineProperties({}, {
        $$typeof: {
            value: CLIENT_REFERENCE
        },
        // Represents the whole Module object instead of a particular import.
        $$id: {
            value: moduleId
        },
        $$async: {
            value: false
        }
    });
    return new Proxy(clientReference, proxyHandlers);
} //# sourceMappingURL=module-proxy.js.map


/***/ }),

/***/ 18829:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* __next_internal_client_entry_do_not_use__  cjs */ 
const { createProxy  } = __webpack_require__(35985);
module.exports = createProxy("/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/node_modules/next/dist/client/components/app-router.js");
 //# sourceMappingURL=app-router.js.map


/***/ }),

/***/ 28412:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* __next_internal_client_entry_do_not_use__  cjs */ 
const { createProxy  } = __webpack_require__(35985);
module.exports = createProxy("/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/node_modules/next/dist/client/components/error-boundary.js");
 //# sourceMappingURL=error-boundary.js.map


/***/ }),

/***/ 45226:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* __next_internal_client_entry_do_not_use__  cjs */ 
const { createProxy  } = __webpack_require__(35985);
module.exports = createProxy("/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/node_modules/next/dist/client/components/layout-router.js");
 //# sourceMappingURL=layout-router.js.map


/***/ }),

/***/ 42872:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* __next_internal_client_entry_do_not_use__  cjs */ 
const { createProxy  } = __webpack_require__(35985);
module.exports = createProxy("/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/node_modules/next/dist/client/components/render-from-template-context.js");
 //# sourceMappingURL=render-from-template-context.js.map


/***/ }),

/***/ 75183:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "createSearchParamsBailoutProxy", ({
    enumerable: true,
    get: function() {
        return createSearchParamsBailoutProxy;
    }
}));
const _staticgenerationbailout = __webpack_require__(79282);
function createSearchParamsBailoutProxy() {
    return new Proxy({}, {
        get (_target, prop) {
            // React adds some properties on the object when serializing for client components
            if (typeof prop === "string") {
                (0, _staticgenerationbailout.staticGenerationBailout)("searchParams." + prop);
            }
        }
    });
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=searchparams-bailout-proxy.js.map


/***/ }),

/***/ 23785:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* __next_internal_client_entry_do_not_use__  cjs */ 
const { createProxy  } = __webpack_require__(35985);
module.exports = createProxy("/Users/samhenry/patriot-heavy-ops/patriot-heavy-ops/node_modules/next/dist/client/components/static-generation-searchparams-bailout-provider.js");
 //# sourceMappingURL=static-generation-searchparams-bailout-provider.js.map


/***/ }),

/***/ 84997:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/**
 * @license React
 * react-dom-server-rendering-stub.production.min.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ 
var d = {
    usingClientEntryPoint: !1,
    Events: null,
    Dispatcher: {
        current: null
    }
};
function e(c) {
    for(var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + c, a = 1; a < arguments.length; a++)b += "&args[]=" + encodeURIComponent(arguments[a]);
    return "Minified React error #" + c + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var f = d.Dispatcher;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = d;
exports.createPortal = function() {
    throw Error(e(448));
};
exports.flushSync = function() {
    throw Error(e(449));
};
exports.preconnect = function(c, b) {
    var a = f.current;
    a && a.preconnect(c, b);
};
exports.prefetchDNS = function(c) {
    var b = f.current;
    b && b.prefetchDNS(c);
};
exports.preinit = function(c, b) {
    var a = f.current;
    a && a.preinit(c, b);
};
exports.preload = function(c, b) {
    var a = f.current;
    a && a.preload(c, b);
};
exports.version = "18.3.0-next-6eadbe0c4-20230425";


/***/ }),

/***/ 3592:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

if (true) {
    module.exports = __webpack_require__(84997);
} else {}


/***/ }),

/***/ 31336:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/**
 * @license React
 * react-server-dom-webpack-server.edge.production.min.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ 
var aa = __webpack_require__(34212), ba = __webpack_require__(3592), l = null, m = 0;
function n(a, b) {
    if (0 !== b.length) if (512 < b.length) 0 < m && (a.enqueue(new Uint8Array(l.buffer, 0, m)), l = new Uint8Array(512), m = 0), a.enqueue(b);
    else {
        var d = l.length - m;
        d < b.length && (0 === d ? a.enqueue(l) : (l.set(b.subarray(0, d), m), a.enqueue(l), b = b.subarray(d)), l = new Uint8Array(512), m = 0);
        l.set(b, m);
        m += b.length;
    }
    return !0;
}
var p = new TextEncoder;
function ca(a, b) {
    "function" === typeof a.error ? a.error(b) : a.close();
}
var q = JSON.stringify;
function da(a, b, d) {
    a = q(d, a.toJSON);
    b = b.toString(16) + ":" + a + "\n";
    return p.encode(b);
}
function t(a, b, d) {
    a = q(d);
    b = b.toString(16) + ":" + a + "\n";
    return p.encode(b);
}
var u = Symbol.for("react.client.reference"), ea = Symbol.for("react.server.reference"), ka = {
    prefetchDNS: fa,
    preconnect: ha,
    preload: ia,
    preinit: ja
};
function fa(a, b) {
    if ("string" === typeof a) {
        var d = v();
        if (d) {
            var c = d.hints, e = "D" + a;
            c.has(e) || (c.add(e), b ? A(d, "D", [
                a,
                b
            ]) : A(d, "D", a), B(d));
        }
    }
}
function ha(a, b) {
    if ("string" === typeof a) {
        var d = v();
        if (d) {
            var c = d.hints, e = null == b || "string" !== typeof b.crossOrigin ? null : "use-credentials" === b.crossOrigin ? "use-credentials" : "";
            e = "C" + (null === e ? "null" : e) + "|" + a;
            c.has(e) || (c.add(e), b ? A(d, "C", [
                a,
                b
            ]) : A(d, "C", a), B(d));
        }
    }
}
function ia(a, b) {
    if ("string" === typeof a) {
        var d = v();
        if (d) {
            var c = d.hints, e = "L" + a;
            c.has(e) || (c.add(e), A(d, "L", [
                a,
                b
            ]), B(d));
        }
    }
}
function ja(a, b) {
    if ("string" === typeof a) {
        var d = v();
        if (d) {
            var c = d.hints, e = "I" + a;
            c.has(e) || (c.add(e), A(d, "I", [
                a,
                b
            ]), B(d));
        }
    }
}
var ma = ba.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.Dispatcher, C = "function" === typeof AsyncLocalStorage, na = C ? new AsyncLocalStorage : null, D = Symbol.for("react.element"), oa = Symbol.for("react.fragment"), pa = Symbol.for("react.provider"), qa = Symbol.for("react.server_context"), ra = Symbol.for("react.forward_ref"), sa = Symbol.for("react.suspense"), ta = Symbol.for("react.suspense_list"), ua = Symbol.for("react.memo"), E = Symbol.for("react.lazy"), va = Symbol.for("react.default_value"), wa = Symbol.for("react.memo_cache_sentinel"), xa = Symbol.iterator, F = null;
function G(a, b) {
    if (a !== b) {
        a.context._currentValue = a.parentValue;
        a = a.parent;
        var d = b.parent;
        if (null === a) {
            if (null !== d) throw Error("The stacks must reach the root at the same time. This is a bug in React.");
        } else {
            if (null === d) throw Error("The stacks must reach the root at the same time. This is a bug in React.");
            G(a, d);
            b.context._currentValue = b.value;
        }
    }
}
function ya(a) {
    a.context._currentValue = a.parentValue;
    a = a.parent;
    null !== a && ya(a);
}
function za(a) {
    var b = a.parent;
    null !== b && za(b);
    a.context._currentValue = a.value;
}
function Aa(a, b) {
    a.context._currentValue = a.parentValue;
    a = a.parent;
    if (null === a) throw Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
    a.depth === b.depth ? G(a, b) : Aa(a, b);
}
function Ba(a, b) {
    var d = b.parent;
    if (null === d) throw Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
    a.depth === d.depth ? G(a, d) : Ba(a, d);
    b.context._currentValue = b.value;
}
function H(a) {
    var b = F;
    b !== a && (null === b ? za(a) : null === a ? ya(b) : b.depth === a.depth ? G(b, a) : b.depth > a.depth ? Aa(b, a) : Ba(b, a), F = a);
}
function Ca(a, b) {
    var d = a._currentValue;
    a._currentValue = b;
    var c = F;
    return F = a = {
        parent: c,
        depth: null === c ? 0 : c.depth + 1,
        context: a,
        parentValue: d,
        value: b
    };
}
var I = Error("Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`");
function Da() {}
function Ea(a, b, d) {
    d = a[d];
    void 0 === d ? a.push(b) : d !== b && (b.then(Da, Da), b = d);
    switch(b.status){
        case "fulfilled":
            return b.value;
        case "rejected":
            throw b.reason;
        default:
            if ("string" !== typeof b.status) switch(a = b, a.status = "pending", a.then(function(c) {
                if ("pending" === b.status) {
                    var e = b;
                    e.status = "fulfilled";
                    e.value = c;
                }
            }, function(c) {
                if ("pending" === b.status) {
                    var e = b;
                    e.status = "rejected";
                    e.reason = c;
                }
            }), b.status){
                case "fulfilled":
                    return b.value;
                case "rejected":
                    throw b.reason;
            }
            J = b;
            throw I;
    }
}
var J = null;
function Fa() {
    if (null === J) throw Error("Expected a suspended thenable. This is a bug in React. Please file an issue.");
    var a = J;
    J = null;
    return a;
}
var K = null, L = 0, M = null;
function Ga() {
    var a = M;
    M = null;
    return a;
}
function Ha(a) {
    return a._currentValue;
}
var La = {
    useMemo: function(a) {
        return a();
    },
    useCallback: function(a) {
        return a;
    },
    useDebugValue: function() {},
    useDeferredValue: N,
    useTransition: N,
    readContext: Ha,
    useContext: Ha,
    useReducer: N,
    useRef: N,
    useState: N,
    useInsertionEffect: N,
    useLayoutEffect: N,
    useImperativeHandle: N,
    useEffect: N,
    useId: Ia,
    useMutableSource: N,
    useSyncExternalStore: N,
    useCacheRefresh: function() {
        return Ja;
    },
    useMemoCache: function(a) {
        for(var b = Array(a), d = 0; d < a; d++)b[d] = wa;
        return b;
    },
    use: Ka
};
function N() {
    throw Error("This Hook is not supported in Server Components.");
}
function Ja() {
    throw Error("Refreshing the cache is not supported in Server Components.");
}
function Ia() {
    if (null === K) throw Error("useId can only be used while React is rendering");
    var a = K.identifierCount++;
    return ":" + K.identifierPrefix + "S" + a.toString(32) + ":";
}
function Ka(a) {
    if (null !== a && "object" === typeof a || "function" === typeof a) {
        if ("function" === typeof a.then) {
            var b = L;
            L += 1;
            null === M && (M = []);
            return Ea(M, a, b);
        }
        if (a.$$typeof === qa) return a._currentValue;
    }
    throw Error("An unsupported type was passed to use(): " + String(a));
}
function Ma() {
    return (new AbortController).signal;
}
function Na() {
    var a = v();
    return a ? a.cache : new Map;
}
var Oa = {
    getCacheSignal: function() {
        var a = Na(), b = a.get(Ma);
        void 0 === b && (b = Ma(), a.set(Ma, b));
        return b;
    },
    getCacheForType: function(a) {
        var b = Na(), d = b.get(a);
        void 0 === d && (d = a(), b.set(a, d));
        return d;
    }
}, Pa = Array.isArray;
function Qa(a) {
    return Object.prototype.toString.call(a).replace(/^\[object (.*)\]$/, function(b, d) {
        return d;
    });
}
function Ra(a) {
    switch(typeof a){
        case "string":
            return JSON.stringify(10 >= a.length ? a : a.slice(0, 10) + "...");
        case "object":
            if (Pa(a)) return "[...]";
            a = Qa(a);
            return "Object" === a ? "{...}" : a;
        case "function":
            return "function";
        default:
            return String(a);
    }
}
function O(a) {
    if ("string" === typeof a) return a;
    switch(a){
        case sa:
            return "Suspense";
        case ta:
            return "SuspenseList";
    }
    if ("object" === typeof a) switch(a.$$typeof){
        case ra:
            return O(a.render);
        case ua:
            return O(a.type);
        case E:
            var b = a._payload;
            a = a._init;
            try {
                return O(a(b));
            } catch (d) {}
    }
    return "";
}
function P(a, b) {
    var d = Qa(a);
    if ("Object" !== d && "Array" !== d) return d;
    d = -1;
    var c = 0;
    if (Pa(a)) {
        var e = "[";
        for(var f = 0; f < a.length; f++){
            0 < f && (e += ", ");
            var g = a[f];
            g = "object" === typeof g && null !== g ? P(g) : Ra(g);
            "" + f === b ? (d = e.length, c = g.length, e += g) : e = 10 > g.length && 40 > e.length + g.length ? e + g : e + "...";
        }
        e += "]";
    } else if (a.$$typeof === D) e = "<" + O(a.type) + "/>";
    else {
        e = "{";
        f = Object.keys(a);
        for(g = 0; g < f.length; g++){
            0 < g && (e += ", ");
            var h = f[g], k = JSON.stringify(h);
            e += ('"' + h + '"' === k ? h : k) + ": ";
            k = a[h];
            k = "object" === typeof k && null !== k ? P(k) : Ra(k);
            h === b ? (d = e.length, c = k.length, e += k) : e = 10 > k.length && 40 > e.length + k.length ? e + k : e + "...";
        }
        e += "}";
    }
    return void 0 === b ? e : -1 < d && 0 < c ? (a = " ".repeat(d) + "^".repeat(c), "\n  " + e + "\n  " + a) : "\n  " + e;
}
var Sa = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Ta = Sa.ContextRegistry, Ua = Sa.ReactCurrentDispatcher, Va = Sa.ReactCurrentCache;
function Wa(a) {
    console.error(a);
}
function Xa(a, b, d, c, e) {
    if (null !== Va.current && Va.current !== Oa) throw Error("Currently React only supports one RSC renderer at a time.");
    ma.current = ka;
    Va.current = Oa;
    var f = new Set, g = [], h = new Set, k = {
        status: 0,
        flushScheduled: !1,
        fatalError: null,
        destination: null,
        bundlerConfig: b,
        cache: new Map,
        nextChunkId: 0,
        pendingChunks: 0,
        hints: h,
        abortableTasks: f,
        pingedTasks: g,
        completedImportChunks: [],
        completedHintChunks: [],
        completedJSONChunks: [],
        completedErrorChunks: [],
        writtenSymbols: new Map,
        writtenClientReferences: new Map,
        writtenServerReferences: new Map,
        writtenProviders: new Map,
        identifierPrefix: e || "",
        identifierCount: 1,
        onError: void 0 === d ? Wa : d,
        toJSON: function(r, w) {
            return Ya(k, this, r, w);
        }
    };
    k.pendingChunks++;
    b = Za(c);
    a = $a(k, a, b, f);
    g.push(a);
    return k;
}
var Q = null;
function v() {
    if (Q) return Q;
    if (C) {
        var a = na.getStore();
        if (a) return a;
    }
    return null;
}
var ab = {};
function bb(a, b) {
    a.pendingChunks++;
    var d = $a(a, null, F, a.abortableTasks);
    switch(b.status){
        case "fulfilled":
            return d.model = b.value, cb(a, d), d.id;
        case "rejected":
            var c = R(a, b.reason);
            S(a, d.id, c);
            return d.id;
        default:
            "string" !== typeof b.status && (b.status = "pending", b.then(function(e) {
                "pending" === b.status && (b.status = "fulfilled", b.value = e);
            }, function(e) {
                "pending" === b.status && (b.status = "rejected", b.reason = e);
            }));
    }
    b.then(function(e) {
        d.model = e;
        cb(a, d);
    }, function(e) {
        d.status = 4;
        e = R(a, e);
        S(a, d.id, e);
        null !== a.destination && T(a, a.destination);
    });
    return d.id;
}
function db(a) {
    if ("fulfilled" === a.status) return a.value;
    if ("rejected" === a.status) throw a.reason;
    throw a;
}
function eb(a) {
    switch(a.status){
        case "fulfilled":
        case "rejected":
            break;
        default:
            "string" !== typeof a.status && (a.status = "pending", a.then(function(b) {
                "pending" === a.status && (a.status = "fulfilled", a.value = b);
            }, function(b) {
                "pending" === a.status && (a.status = "rejected", a.reason = b);
            }));
    }
    return {
        $$typeof: E,
        _payload: a,
        _init: db
    };
}
function U(a, b, d, c, e, f) {
    if (null !== c && void 0 !== c) throw Error("Refs cannot be used in Server Components, nor passed to Client Components.");
    if ("function" === typeof b) {
        if (b.$$typeof === u) return [
            D,
            b,
            d,
            e
        ];
        L = 0;
        M = f;
        e = b(e);
        return "object" === typeof e && null !== e && "function" === typeof e.then ? "fulfilled" === e.status ? e.value : eb(e) : e;
    }
    if ("string" === typeof b) return [
        D,
        b,
        d,
        e
    ];
    if ("symbol" === typeof b) return b === oa ? e.children : [
        D,
        b,
        d,
        e
    ];
    if (null != b && "object" === typeof b) {
        if (b.$$typeof === u) return [
            D,
            b,
            d,
            e
        ];
        switch(b.$$typeof){
            case E:
                var g = b._init;
                b = g(b._payload);
                return U(a, b, d, c, e, f);
            case ra:
                return a = b.render, L = 0, M = f, a(e, void 0);
            case ua:
                return U(a, b.type, d, c, e, f);
            case pa:
                return Ca(b._context, e.value), [
                    D,
                    b,
                    d,
                    {
                        value: e.value,
                        children: e.children,
                        __pop: ab
                    }
                ];
        }
    }
    throw Error("Unsupported Server Component type: " + Ra(b));
}
function cb(a, b) {
    var d = a.pingedTasks;
    d.push(b);
    1 === d.length && (a.flushScheduled = null !== a.destination, setTimeout(function() {
        return fb(a);
    }, 0));
}
function $a(a, b, d, c) {
    var e = {
        id: a.nextChunkId++,
        status: 0,
        model: b,
        context: d,
        ping: function() {
            return cb(a, e);
        },
        thenableState: null
    };
    c.add(e);
    return e;
}
function gb(a, b, d, c) {
    var e = c.$$async ? c.$$id + "#async" : c.$$id, f = a.writtenClientReferences, g = f.get(e);
    if (void 0 !== g) return b[0] === D && "1" === d ? "$L" + g.toString(16) : "$" + g.toString(16);
    try {
        var h = a.bundlerConfig, k = c.$$id;
        g = "";
        var r = h[k];
        if (r) g = r.name;
        else {
            var w = k.lastIndexOf("#");
            -1 !== w && (g = k.slice(w + 1), r = h[k.slice(0, w)]);
            if (!r) throw Error('Could not find the module "' + k + '" in the React Client Manifest. This is probably a bug in the React Server Components bundler.');
        }
        var x = {
            id: r.id,
            chunks: r.chunks,
            name: g,
            async: !!c.$$async
        };
        a.pendingChunks++;
        var y = a.nextChunkId++, la = q(x), z = y.toString(16) + ":I" + la + "\n";
        var qb = p.encode(z);
        a.completedImportChunks.push(qb);
        f.set(e, y);
        return b[0] === D && "1" === d ? "$L" + y.toString(16) : "$" + y.toString(16);
    } catch (rb) {
        return a.pendingChunks++, b = a.nextChunkId++, d = R(a, rb), S(a, b, d), "$" + b.toString(16);
    }
}
function Ya(a, b, d, c) {
    switch(c){
        case D:
            return "$";
    }
    for(; "object" === typeof c && null !== c && (c.$$typeof === D || c.$$typeof === E);)try {
        switch(c.$$typeof){
            case D:
                var e = c;
                c = U(a, e.type, e.key, e.ref, e.props, null);
                break;
            case E:
                var f = c._init;
                c = f(c._payload);
        }
    } catch (g) {
        d = g === I ? Fa() : g;
        if ("object" === typeof d && null !== d && "function" === typeof d.then) return a.pendingChunks++, a = $a(a, c, F, a.abortableTasks), c = a.ping, d.then(c, c), a.thenableState = Ga(), "$L" + a.id.toString(16);
        a.pendingChunks++;
        c = a.nextChunkId++;
        d = R(a, d);
        S(a, c, d);
        return "$L" + c.toString(16);
    }
    if (null === c) return null;
    if ("object" === typeof c) {
        if (c.$$typeof === u) return gb(a, b, d, c);
        if ("function" === typeof c.then) return "$@" + bb(a, c).toString(16);
        if (c.$$typeof === pa) return c = c._context._globalName, b = a.writtenProviders, d = b.get(d), void 0 === d && (a.pendingChunks++, d = a.nextChunkId++, b.set(c, d), c = t(a, d, "$P" + c), a.completedJSONChunks.push(c)), "$" + d.toString(16);
        if (c === ab) {
            a = F;
            if (null === a) throw Error("Tried to pop a Context at the root of the app. This is a bug in React.");
            c = a.parentValue;
            a.context._currentValue = c === va ? a.context._defaultValue : c;
            F = a.parent;
            return;
        }
        return !Pa(c) && (null === c || "object" !== typeof c ? a = null : (a = xa && c[xa] || c["@@iterator"], a = "function" === typeof a ? a : null), a) ? Array.from(c) : c;
    }
    if ("string" === typeof c) {
        if ("Z" === c[c.length - 1] && b[d] instanceof Date) return "$D" + c;
        a = "$" === c[0] ? "$" + c : c;
        return a;
    }
    if ("boolean" === typeof c) return c;
    if ("number" === typeof c) return a = c, Number.isFinite(a) ? 0 === a && -Infinity === 1 / a ? "$-0" : a : Infinity === a ? "$Infinity" : -Infinity === a ? "$-Infinity" : "$NaN";
    if ("undefined" === typeof c) return "$undefined";
    if ("function" === typeof c) {
        if (c.$$typeof === u) return gb(a, b, d, c);
        if (c.$$typeof === ea) return d = a.writtenServerReferences, b = d.get(c), void 0 !== b ? a = "$F" + b.toString(16) : (b = c.$$bound, e = {
            id: c.$$id,
            bound: b ? Promise.resolve(b) : null
        }, a.pendingChunks++, b = a.nextChunkId++, e = da(a, b, e), a.completedJSONChunks.push(e), d.set(c, b), a = "$F" + b.toString(16)), a;
        if (/^on[A-Z]/.test(d)) throw Error("Event handlers cannot be passed to Client Component props." + P(b, d) + "\nIf you need interactivity, consider converting part of this to a Client Component.");
        throw Error('Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server".' + P(b, d));
    }
    if ("symbol" === typeof c) {
        e = a.writtenSymbols;
        f = e.get(c);
        if (void 0 !== f) return "$" + f.toString(16);
        f = c.description;
        if (Symbol.for(f) !== c) throw Error("Only global symbols received from Symbol.for(...) can be passed to Client Components. The symbol Symbol.for(" + (c.description + ") cannot be found among global symbols.") + P(b, d));
        a.pendingChunks++;
        d = a.nextChunkId++;
        b = t(a, d, "$S" + f);
        a.completedImportChunks.push(b);
        e.set(c, d);
        return "$" + d.toString(16);
    }
    if ("bigint" === typeof c) return "$n" + c.toString(10);
    throw Error("Type " + typeof c + " is not supported in Client Component props." + P(b, d));
}
function R(a, b) {
    a = a.onError;
    b = a(b);
    if (null != b && "string" !== typeof b) throw Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof b + '" instead');
    return b || "";
}
function hb(a, b) {
    null !== a.destination ? (a.status = 2, ca(a.destination, b)) : (a.status = 1, a.fatalError = b);
}
function S(a, b, d) {
    d = {
        digest: d
    };
    b = b.toString(16) + ":E" + q(d) + "\n";
    b = p.encode(b);
    a.completedErrorChunks.push(b);
}
function A(a, b, d) {
    var c = a.nextChunkId++;
    d = q(d);
    b = "H" + b;
    c = c.toString(16) + ":" + b;
    c = p.encode(c + d + "\n");
    a.completedHintChunks.push(c);
}
function fb(a) {
    var b = Ua.current;
    Ua.current = La;
    var d = Q;
    K = Q = a;
    try {
        var c = a.pingedTasks;
        a.pingedTasks = [];
        for(var e = 0; e < c.length; e++){
            var f = c[e];
            var g = a;
            if (0 === f.status) {
                H(f.context);
                try {
                    var h = f.model;
                    if ("object" === typeof h && null !== h && h.$$typeof === D) {
                        var k = h, r = f.thenableState;
                        f.model = h;
                        h = U(g, k.type, k.key, k.ref, k.props, r);
                        for(f.thenableState = null; "object" === typeof h && null !== h && h.$$typeof === D;)k = h, f.model = h, h = U(g, k.type, k.key, k.ref, k.props, null);
                    }
                    var w = da(g, f.id, h);
                    g.completedJSONChunks.push(w);
                    g.abortableTasks.delete(f);
                    f.status = 1;
                } catch (z) {
                    var x = z === I ? Fa() : z;
                    if ("object" === typeof x && null !== x && "function" === typeof x.then) {
                        var y = f.ping;
                        x.then(y, y);
                        f.thenableState = Ga();
                    } else {
                        g.abortableTasks.delete(f);
                        f.status = 4;
                        var la = R(g, x);
                        S(g, f.id, la);
                    }
                }
            }
        }
        null !== a.destination && T(a, a.destination);
    } catch (z) {
        R(a, z), hb(a, z);
    } finally{
        Ua.current = b, K = null, Q = d;
    }
}
function T(a, b) {
    l = new Uint8Array(512);
    m = 0;
    try {
        for(var d = a.completedImportChunks, c = 0; c < d.length; c++)a.pendingChunks--, n(b, d[c]);
        d.splice(0, c);
        var e = a.completedHintChunks;
        for(c = 0; c < e.length; c++)n(b, e[c]);
        e.splice(0, c);
        var f = a.completedJSONChunks;
        for(c = 0; c < f.length; c++)a.pendingChunks--, n(b, f[c]);
        f.splice(0, c);
        var g = a.completedErrorChunks;
        for(c = 0; c < g.length; c++)a.pendingChunks--, n(b, g[c]);
        g.splice(0, c);
    } finally{
        a.flushScheduled = !1, l && 0 < m && (b.enqueue(new Uint8Array(l.buffer, 0, m)), l = null, m = 0);
    }
    0 === a.pendingChunks && b.close();
}
function ib(a) {
    a.flushScheduled = null !== a.destination;
    C ? setTimeout(function() {
        return na.run(a, fb, a);
    }, 0) : setTimeout(function() {
        return fb(a);
    }, 0);
}
function B(a) {
    if (!1 === a.flushScheduled && 0 === a.pingedTasks.length && null !== a.destination) {
        var b = a.destination;
        a.flushScheduled = !0;
        setTimeout(function() {
            return T(a, b);
        }, 0);
    }
}
function jb(a, b) {
    try {
        var d = a.abortableTasks;
        if (0 < d.size) {
            var c = R(a, void 0 === b ? Error("The render was aborted by the server without a reason.") : b);
            a.pendingChunks++;
            var e = a.nextChunkId++;
            S(a, e, c);
            d.forEach(function(f) {
                f.status = 3;
                var g = "$" + e.toString(16);
                f = t(a, f.id, g);
                a.completedErrorChunks.push(f);
            });
            d.clear();
        }
        null !== a.destination && T(a, a.destination);
    } catch (f) {
        R(a, f), hb(a, f);
    }
}
function Za(a) {
    if (a) {
        var b = F;
        H(null);
        for(var d = 0; d < a.length; d++){
            var c = a[d], e = c[0];
            c = c[1];
            Ta[e] || (Ta[e] = aa.createServerContext(e, va));
            Ca(Ta[e], c);
        }
        a = F;
        H(b);
        return a;
    }
    return null;
}
function kb(a, b) {
    var d = "", c = a[b];
    if (c) d = c.name;
    else {
        var e = b.lastIndexOf("#");
        -1 !== e && (d = b.slice(e + 1), c = a[b.slice(0, e)]);
        if (!c) throw Error('Could not find the module "' + b + '" in the React Server Manifest. This is probably a bug in the React Server Components bundler.');
    }
    return {
        id: c.id,
        chunks: c.chunks,
        name: d,
        async: !1
    };
}
var V = new Map, lb = new Map;
function mb() {}
function nb(a) {
    for(var b = a.chunks, d = [], c = 0; c < b.length; c++){
        var e = b[c], f = V.get(e);
        if (void 0 === f) {
            f = globalThis.__next_chunk_load__(e);
            d.push(f);
            var g = V.set.bind(V, e, null);
            f.then(g, mb);
            V.set(e, f);
        } else null !== f && d.push(f);
    }
    if (a.async) {
        if (b = lb.get(a.id)) return "fulfilled" === b.status ? null : b;
        var h = Promise.all(d).then(function() {
            return globalThis.__next_require__(a.id);
        });
        h.then(function(k) {
            h.status = "fulfilled";
            h.value = k;
        }, function(k) {
            h.status = "rejected";
            h.reason = k;
        });
        lb.set(a.id, h);
        return h;
    }
    return 0 < d.length ? Promise.all(d) : null;
}
function ob(a) {
    if (a.async) {
        var b = lb.get(a.id);
        if ("fulfilled" === b.status) b = b.value;
        else throw b.reason;
    } else b = globalThis.__next_require__(a.id);
    return "*" === a.name ? b : "" === a.name ? b.__esModule ? b.default : b : b[a.name];
}
function W(a, b, d, c) {
    this.status = a;
    this.value = b;
    this.reason = d;
    this._response = c;
}
W.prototype = Object.create(Promise.prototype);
W.prototype.then = function(a, b) {
    switch(this.status){
        case "resolved_model":
            pb(this);
    }
    switch(this.status){
        case "fulfilled":
            a(this.value);
            break;
        case "pending":
        case "blocked":
            a && (null === this.value && (this.value = []), this.value.push(a));
            b && (null === this.reason && (this.reason = []), this.reason.push(b));
            break;
        default:
            b(this.reason);
    }
};
function sb(a, b) {
    for(var d = 0; d < a.length; d++)(0, a[d])(b);
}
function tb(a, b) {
    if ("pending" === a.status || "blocked" === a.status) {
        var d = a.reason;
        a.status = "rejected";
        a.reason = b;
        null !== d && sb(d, b);
    }
}
function ub(a, b, d, c, e, f) {
    var g = kb(a._bundlerConfig, b);
    a = nb(g);
    if (d) d = Promise.all([
        d,
        a
    ]).then(function(h) {
        h = h[0];
        var k = ob(g);
        return k.bind.apply(k, [
            null
        ].concat(h));
    });
    else if (a) d = Promise.resolve(a).then(function() {
        return ob(g);
    });
    else return ob(g);
    d.then(vb(c, e, f), wb(c));
    return null;
}
var X = null, Y = null;
function pb(a) {
    var b = X, d = Y;
    X = a;
    Y = null;
    try {
        var c = JSON.parse(a.value, a._response._fromJSON);
        null !== Y && 0 < Y.deps ? (Y.value = c, a.status = "blocked", a.value = null, a.reason = null) : (a.status = "fulfilled", a.value = c);
    } catch (e) {
        a.status = "rejected", a.reason = e;
    } finally{
        X = b, Y = d;
    }
}
function xb(a, b) {
    a._chunks.forEach(function(d) {
        "pending" === d.status && tb(d, b);
    });
}
function Z(a, b) {
    var d = a._chunks, c = d.get(b);
    c || (c = a._formData.get(a._prefix + b), c = null != c ? new W("resolved_model", c, null, a) : new W("pending", null, null, a), d.set(b, c));
    return c;
}
function vb(a, b, d) {
    if (Y) {
        var c = Y;
        c.deps++;
    } else c = Y = {
        deps: 1,
        value: null
    };
    return function(e) {
        b[d] = e;
        c.deps--;
        0 === c.deps && "blocked" === a.status && (e = a.value, a.status = "fulfilled", a.value = c.value, null !== e && sb(e, c.value));
    };
}
function wb(a) {
    return function(b) {
        return tb(a, b);
    };
}
function yb(a, b, d, c) {
    if ("$" === c[0]) switch(c[1]){
        case "$":
            return c.slice(1);
        case "@":
            return b = parseInt(c.slice(2), 16), Z(a, b);
        case "S":
            return Symbol.for(c.slice(2));
        case "F":
            c = parseInt(c.slice(2), 16);
            c = Z(a, c);
            "resolved_model" === c.status && pb(c);
            if ("fulfilled" !== c.status) throw c.reason;
            c = c.value;
            return ub(a, c.id, c.bound, X, b, d);
        case "K":
            b = c.slice(2);
            var e = a._prefix + b + "_", f = new FormData;
            a._formData.forEach(function(g, h) {
                h.startsWith(e) && f.append(h.slice(e.length), g);
            });
            return f;
        case "I":
            return Infinity;
        case "-":
            return "$-0" === c ? -0 : -Infinity;
        case "N":
            return NaN;
        case "u":
            return;
        case "D":
            return new Date(Date.parse(c.slice(2)));
        case "n":
            return BigInt(c.slice(2));
        default:
            c = parseInt(c.slice(1), 16);
            a = Z(a, c);
            switch(a.status){
                case "resolved_model":
                    pb(a);
            }
            switch(a.status){
                case "fulfilled":
                    return a.value;
                case "pending":
                case "blocked":
                    return c = X, a.then(vb(c, b, d), wb(c)), null;
                default:
                    throw a.reason;
            }
    }
    return c;
}
function zb(a, b) {
    var d = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : new FormData, c = new Map, e = {
        _bundlerConfig: a,
        _prefix: b,
        _formData: d,
        _chunks: c,
        _fromJSON: function(f, g) {
            return "string" === typeof g ? yb(e, this, f, g) : g;
        }
    };
    return e;
}
exports.decodeReply = function(a, b) {
    if ("string" === typeof a) {
        var d = new FormData;
        d.append("0", a);
        a = d;
    }
    a = zb(b, "", a);
    xb(a, Error("Connection closed."));
    return Z(a, 0);
};
exports.renderToReadableStream = function(a, b, d) {
    var c = Xa(a, b, d ? d.onError : void 0, d ? d.context : void 0, d ? d.identifierPrefix : void 0);
    if (d && d.signal) {
        var e = d.signal;
        if (e.aborted) jb(c, e.reason);
        else {
            var f = function() {
                jb(c, e.reason);
                e.removeEventListener("abort", f);
            };
            e.addEventListener("abort", f);
        }
    }
    return new ReadableStream({
        type: "bytes",
        start: function() {
            ib(c);
        },
        pull: function(g) {
            if (1 === c.status) c.status = 2, ca(g, c.fatalError);
            else if (2 !== c.status && null === c.destination) {
                c.destination = g;
                try {
                    T(c, g);
                } catch (h) {
                    R(c, h), hb(c, h);
                }
            }
        },
        cancel: function() {}
    }, {
        highWaterMark: 0
    });
};


/***/ }),

/***/ 76370:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

if (true) {
    module.exports = __webpack_require__(31336);
} else {}


/***/ }),

/***/ 29615:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/**
 * @license React
 * react.shared-subset.production.min.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ 
var m = Object.assign, n = {
    current: null
};
function p() {
    return new Map;
}
if ("function" === typeof fetch) {
    var q = fetch, r = function(a, b) {
        var d = n.current;
        if (!d || b && b.signal && b.signal !== d.getCacheSignal()) return q(a, b);
        if ("string" !== typeof a || b) {
            var c = new Request(a, b);
            if ("GET" !== c.method && "HEAD" !== c.method || c.keepalive) return q(a, b);
            var e = JSON.stringify([
                c.method,
                Array.from(c.headers.entries()),
                c.mode,
                c.redirect,
                c.credentials,
                c.referrer,
                c.referrerPolicy,
                c.integrity
            ]);
            c = c.url;
        } else e = '["GET",[],null,"follow",null,null,null,null]', c = a;
        var f = d.getCacheForType(p);
        d = f.get(c);
        if (void 0 === d) a = q(a, b), f.set(c, [
            e,
            a
        ]);
        else {
            c = 0;
            for(f = d.length; c < f; c += 2){
                var h = d[c + 1];
                if (d[c] === e) return a = h, a.then(function(g) {
                    return g.clone();
                });
            }
            a = q(a, b);
            d.push(e, a);
        }
        return a.then(function(g) {
            return g.clone();
        });
    };
    m(r, q);
    try {
        fetch = r;
    } catch (a) {
        try {
            globalThis.fetch = r;
        } catch (b) {
            console.warn("React was unable to patch the fetch() function in this environment. Suspensey APIs might not work correctly as a result.");
        }
    }
}
var t = Symbol.for("react.element"), u = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), w = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), y = Symbol.for("react.provider"), z = Symbol.for("react.server_context"), A = Symbol.for("react.forward_ref"), B = Symbol.for("react.suspense"), C = Symbol.for("react.memo"), aa = Symbol.for("react.lazy"), D = Symbol.for("react.default_value"), E = Symbol.iterator;
function ba(a) {
    if (null === a || "object" !== typeof a) return null;
    a = E && a[E] || a["@@iterator"];
    return "function" === typeof a ? a : null;
}
function F(a) {
    for(var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, d = 1; d < arguments.length; d++)b += "&args[]=" + encodeURIComponent(arguments[d]);
    return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var G = {
    isMounted: function() {
        return !1;
    },
    enqueueForceUpdate: function() {},
    enqueueReplaceState: function() {},
    enqueueSetState: function() {}
}, H = {};
function I(a, b, d) {
    this.props = a;
    this.context = b;
    this.refs = H;
    this.updater = d || G;
}
I.prototype.isReactComponent = {};
I.prototype.setState = function(a, b) {
    if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error(F(85));
    this.updater.enqueueSetState(this, a, b, "setState");
};
I.prototype.forceUpdate = function(a) {
    this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function J() {}
J.prototype = I.prototype;
function K(a, b, d) {
    this.props = a;
    this.context = b;
    this.refs = H;
    this.updater = d || G;
}
var L = K.prototype = new J;
L.constructor = K;
m(L, I.prototype);
L.isPureReactComponent = !0;
var M = Array.isArray, N = Object.prototype.hasOwnProperty, O = {
    current: null
}, P = {
    key: !0,
    ref: !0,
    __self: !0,
    __source: !0
};
function ca(a, b) {
    return {
        $$typeof: t,
        type: a.type,
        key: b,
        ref: a.ref,
        props: a.props,
        _owner: a._owner
    };
}
function Q(a) {
    return "object" === typeof a && null !== a && a.$$typeof === t;
}
function escape(a) {
    var b = {
        "=": "=0",
        ":": "=2"
    };
    return "$" + a.replace(/[=:]/g, function(d) {
        return b[d];
    });
}
var R = /\/+/g;
function S(a, b) {
    return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function T(a, b, d, c, e) {
    var f = typeof a;
    if ("undefined" === f || "boolean" === f) a = null;
    var h = !1;
    if (null === a) h = !0;
    else switch(f){
        case "string":
        case "number":
            h = !0;
            break;
        case "object":
            switch(a.$$typeof){
                case t:
                case u:
                    h = !0;
            }
    }
    if (h) return h = a, e = e(h), a = "" === c ? "." + S(h, 0) : c, M(e) ? (d = "", null != a && (d = a.replace(R, "$&/") + "/"), T(e, b, d, "", function(l) {
        return l;
    })) : null != e && (Q(e) && (e = ca(e, d + (!e.key || h && h.key === e.key ? "" : ("" + e.key).replace(R, "$&/") + "/") + a)), b.push(e)), 1;
    h = 0;
    c = "" === c ? "." : c + ":";
    if (M(a)) for(var g = 0; g < a.length; g++){
        f = a[g];
        var k = c + S(f, g);
        h += T(f, b, d, k, e);
    }
    else if (k = ba(a), "function" === typeof k) for(a = k.call(a), g = 0; !(f = a.next()).done;)f = f.value, k = c + S(f, g++), h += T(f, b, d, k, e);
    else if ("object" === f) throw b = String(a), Error(F(31, "[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b));
    return h;
}
function U(a, b, d) {
    if (null == a) return a;
    var c = [], e = 0;
    T(a, c, "", "", function(f) {
        return b.call(d, f, e++);
    });
    return c;
}
function da(a) {
    if (-1 === a._status) {
        var b = a._result;
        b = b();
        b.then(function(d) {
            if (0 === a._status || -1 === a._status) a._status = 1, a._result = d;
        }, function(d) {
            if (0 === a._status || -1 === a._status) a._status = 2, a._result = d;
        });
        -1 === a._status && (a._status = 0, a._result = b);
    }
    if (1 === a._status) return a._result.default;
    throw a._result;
}
function ea() {
    return new WeakMap;
}
function V() {
    return {
        s: 0,
        v: void 0,
        o: null,
        p: null
    };
}
var W = {
    current: null
}, X = {
    transition: null
}, Y = {
    ReactCurrentDispatcher: W,
    ReactCurrentCache: n,
    ReactCurrentBatchConfig: X,
    ReactCurrentOwner: O,
    ContextRegistry: {}
}, Z = Y.ContextRegistry;
exports.Children = {
    map: U,
    forEach: function(a, b, d) {
        U(a, function() {
            b.apply(this, arguments);
        }, d);
    },
    count: function(a) {
        var b = 0;
        U(a, function() {
            b++;
        });
        return b;
    },
    toArray: function(a) {
        return U(a, function(b) {
            return b;
        }) || [];
    },
    only: function(a) {
        if (!Q(a)) throw Error(F(143));
        return a;
    }
};
exports.Fragment = v;
exports.Profiler = x;
exports.StrictMode = w;
exports.Suspense = B;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Y;
exports.cache = function(a) {
    return function() {
        var b = n.current;
        if (!b) return a.apply(null, arguments);
        var d = b.getCacheForType(ea);
        b = d.get(a);
        void 0 === b && (b = V(), d.set(a, b));
        d = 0;
        for(var c = arguments.length; d < c; d++){
            var e = arguments[d];
            if ("function" === typeof e || "object" === typeof e && null !== e) {
                var f = b.o;
                null === f && (b.o = f = new WeakMap);
                b = f.get(e);
                void 0 === b && (b = V(), f.set(e, b));
            } else f = b.p, null === f && (b.p = f = new Map), b = f.get(e), void 0 === b && (b = V(), f.set(e, b));
        }
        if (1 === b.s) return b.v;
        if (2 === b.s) throw b.v;
        try {
            var h = a.apply(null, arguments);
            d = b;
            d.s = 1;
            return d.v = h;
        } catch (g) {
            throw h = b, h.s = 2, h.v = g, g;
        }
    };
};
exports.cloneElement = function(a, b, d) {
    if (null === a || void 0 === a) throw Error(F(267, a));
    var c = m({}, a.props), e = a.key, f = a.ref, h = a._owner;
    if (null != b) {
        void 0 !== b.ref && (f = b.ref, h = O.current);
        void 0 !== b.key && (e = "" + b.key);
        if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
        for(k in b)N.call(b, k) && !P.hasOwnProperty(k) && (c[k] = void 0 === b[k] && void 0 !== g ? g[k] : b[k]);
    }
    var k = arguments.length - 2;
    if (1 === k) c.children = d;
    else if (1 < k) {
        g = Array(k);
        for(var l = 0; l < k; l++)g[l] = arguments[l + 2];
        c.children = g;
    }
    return {
        $$typeof: t,
        type: a.type,
        key: e,
        ref: f,
        props: c,
        _owner: h
    };
};
exports.createElement = function(a, b, d) {
    var c, e = {}, f = null, h = null;
    if (null != b) for(c in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (f = "" + b.key), b)N.call(b, c) && !P.hasOwnProperty(c) && (e[c] = b[c]);
    var g = arguments.length - 2;
    if (1 === g) e.children = d;
    else if (1 < g) {
        for(var k = Array(g), l = 0; l < g; l++)k[l] = arguments[l + 2];
        e.children = k;
    }
    if (a && a.defaultProps) for(c in g = a.defaultProps, g)void 0 === e[c] && (e[c] = g[c]);
    return {
        $$typeof: t,
        type: a,
        key: f,
        ref: h,
        props: e,
        _owner: O.current
    };
};
exports.createRef = function() {
    return {
        current: null
    };
};
exports.createServerContext = function(a, b) {
    var d = !0;
    if (!Z[a]) {
        d = !1;
        var c = {
            $$typeof: z,
            _currentValue: b,
            _currentValue2: b,
            _defaultValue: b,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
            _globalName: a
        };
        c.Provider = {
            $$typeof: y,
            _context: c
        };
        Z[a] = c;
    }
    c = Z[a];
    if (c._defaultValue === D) c._defaultValue = b, c._currentValue === D && (c._currentValue = b), c._currentValue2 === D && (c._currentValue2 = b);
    else if (d) throw Error(F(429, a));
    return c;
};
exports.forwardRef = function(a) {
    return {
        $$typeof: A,
        render: a
    };
};
exports.isValidElement = Q;
exports.lazy = function(a) {
    return {
        $$typeof: aa,
        _payload: {
            _status: -1,
            _result: a
        },
        _init: da
    };
};
exports.memo = function(a, b) {
    return {
        $$typeof: C,
        type: a,
        compare: void 0 === b ? null : b
    };
};
exports.startTransition = function(a) {
    var b = X.transition;
    X.transition = {};
    try {
        a();
    } finally{
        X.transition = b;
    }
};
exports.use = function(a) {
    return W.current.use(a);
};
exports.useCallback = function(a, b) {
    return W.current.useCallback(a, b);
};
exports.useContext = function(a) {
    return W.current.useContext(a);
};
exports.useDebugValue = function() {};
exports.useId = function() {
    return W.current.useId();
};
exports.useMemo = function(a, b) {
    return W.current.useMemo(a, b);
};
exports.version = "18.3.0-next-6eadbe0c4-20230425";


/***/ }),

/***/ 34212:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

if (true) {
    module.exports = __webpack_require__(29615);
} else {}


/***/ }),

/***/ 12548:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
    fillMetadataSegment: function() {
        return fillMetadataSegment;
    },
    normalizeMetadataRoute: function() {
        return normalizeMetadataRoute;
    }
});
const _ismetadataroute = __webpack_require__(91599);
const _path = /*#__PURE__*/ _interop_require_default(__webpack_require__(36764));
const _serverutils = __webpack_require__(20459);
const _routeregex = __webpack_require__(1937);
const _hash = __webpack_require__(19809);
const _apppaths = __webpack_require__(38798);
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/*
 * If there's special convention like (...) or @ in the page path,
 * Give it a unique hash suffix to avoid conflicts
 *
 * e.g.
 * /app/open-graph.tsx -> /open-graph/route
 * /app/(post)/open-graph.tsx -> /open-graph/route-[0-9a-z]{6}
 */ function getMetadataRouteSuffix(page) {
    let suffix = "";
    if (page.includes("(") && page.includes(")") || page.includes("@")) {
        suffix = (0, _hash.djb2Hash)(page).toString(36).slice(0, 6);
    }
    return suffix;
}
function fillMetadataSegment(segment, params, imageSegment) {
    const pathname = (0, _apppaths.normalizeAppPath)(segment);
    const routeRegex = (0, _routeregex.getNamedRouteRegex)(pathname, false);
    const route = (0, _serverutils.interpolateDynamicPath)(pathname, params, routeRegex);
    const suffix = getMetadataRouteSuffix(segment);
    const routeSuffix = suffix ? `-${suffix}` : "";
    const { name , ext  } = _path.default.parse(imageSegment);
    return _path.default.join(route, `${name}${routeSuffix}${ext}`);
}
function normalizeMetadataRoute(page) {
    if (!(0, _ismetadataroute.isMetadataRoute)(page)) {
        return page;
    }
    let route = page;
    let suffix = "";
    if (route === "/robots") {
        route += ".txt";
    } else if (route === "/manifest") {
        route += ".webmanifest";
    } else if (route.endsWith("/sitemap")) {
        route += ".xml";
    } else {
        // Remove the file extension, e.g. /route-path/robots.txt -> /route-path
        const pathnamePrefix = page.slice(0, -(_path.default.basename(page).length + 1));
        suffix = getMetadataRouteSuffix(pathnamePrefix);
    }
    // Support both /<metadata-route.ext> and custom routes /<metadata-route>/route.ts.
    // If it's a metadata file route, we need to append /[id]/route to the page.
    if (!route.endsWith("/route")) {
        const isStaticMetadataFile = (0, _ismetadataroute.isMetadataRouteFile)(page, [], true);
        const { dir , name: baseName , ext  } = _path.default.parse(route);
        const isStaticRoute = page.startsWith("/robots") || page.startsWith("/manifest") || isStaticMetadataFile;
        route = _path.default.posix.join(dir, `${baseName}${suffix ? `-${suffix}` : ""}${ext}`, isStaticRoute ? "" : "[[...__metadata_id__]]", "route");
    }
    return route;
} //# sourceMappingURL=get-metadata-route.js.map


/***/ }),

/***/ 91599:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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
    STATIC_METADATA_IMAGES: function() {
        return STATIC_METADATA_IMAGES;
    },
    isMetadataRouteFile: function() {
        return isMetadataRouteFile;
    },
    isMetadataRoute: function() {
        return isMetadataRoute;
    }
});
const STATIC_METADATA_IMAGES = {
    icon: {
        filename: "icon",
        extensions: [
            "ico",
            "jpg",
            "jpeg",
            "png",
            "svg"
        ]
    },
    apple: {
        filename: "apple-icon",
        extensions: [
            "jpg",
            "jpeg",
            "png"
        ]
    },
    favicon: {
        filename: "favicon",
        extensions: [
            "ico"
        ]
    },
    openGraph: {
        filename: "opengraph-image",
        extensions: [
            "jpg",
            "jpeg",
            "png",
            "gif"
        ]
    },
    twitter: {
        filename: "twitter-image",
        extensions: [
            "jpg",
            "jpeg",
            "png",
            "gif"
        ]
    }
};
// Match routes that are metadata routes, e.g. /sitemap.xml, /favicon.<ext>, /<icon>.<ext>, etc.
// TODO-METADATA: support more metadata routes with more extensions
const defaultExtensions = [
    "js",
    "jsx",
    "ts",
    "tsx"
];
const getExtensionRegexString = (extensions)=>`(?:${extensions.join("|")})`;
function isMetadataRouteFile(appDirRelativePath, pageExtensions, withExtension) {
    const metadataRouteFilesRegex = [
        new RegExp(`^[\\\\/]robots${withExtension ? `\\.${getExtensionRegexString(pageExtensions.concat("txt"))}$` : ""}`),
        new RegExp(`^[\\\\/]manifest${withExtension ? `\\.${getExtensionRegexString(pageExtensions.concat("webmanifest", "json"))}$` : ""}`),
        new RegExp(`^[\\\\/]favicon\\.ico$`),
        new RegExp(`[\\\\/]sitemap${withExtension ? `\\.${getExtensionRegexString(pageExtensions.concat("xml"))}$` : ""}`),
        new RegExp(`[\\\\/]${STATIC_METADATA_IMAGES.icon.filename}\\d?${withExtension ? `\\.${getExtensionRegexString(pageExtensions.concat(STATIC_METADATA_IMAGES.icon.extensions))}$` : ""}`),
        new RegExp(`[\\\\/]${STATIC_METADATA_IMAGES.apple.filename}\\d?${withExtension ? `\\.${getExtensionRegexString(pageExtensions.concat(STATIC_METADATA_IMAGES.apple.extensions))}$` : ""}`),
        new RegExp(`[\\\\/]${STATIC_METADATA_IMAGES.openGraph.filename}\\d?${withExtension ? `\\.${getExtensionRegexString(pageExtensions.concat(STATIC_METADATA_IMAGES.openGraph.extensions))}$` : ""}`),
        new RegExp(`[\\\\/]${STATIC_METADATA_IMAGES.twitter.filename}\\d?${withExtension ? `\\.${getExtensionRegexString(pageExtensions.concat(STATIC_METADATA_IMAGES.twitter.extensions))}$` : ""}`)
    ];
    return metadataRouteFilesRegex.some((r)=>r.test(appDirRelativePath));
}
function isMetadataRoute(route) {
    let page = route.replace(/^\/?app\//, "").replace(/\/route$/, "");
    if (page[0] !== "/") page = "/" + page;
    return !page.endsWith("/page") && isMetadataRouteFile(page, defaultExtensions, false);
} //# sourceMappingURL=is-metadata-route.js.map


/***/ }),

/***/ 47939:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "acceptLanguage", ({
    enumerable: true,
    get: function() {
        return acceptLanguage;
    }
}));
function parse(raw, preferences, options) {
    const lowers = new Map();
    const header = raw.replace(/[ \t]/g, "");
    if (preferences) {
        let pos = 0;
        for (const preference of preferences){
            const lower = preference.toLowerCase();
            lowers.set(lower, {
                orig: preference,
                pos: pos++
            });
            if (options.prefixMatch) {
                const parts = lower.split("-");
                while(parts.pop(), parts.length > 0){
                    const joined = parts.join("-");
                    if (!lowers.has(joined)) {
                        lowers.set(joined, {
                            orig: preference,
                            pos: pos++
                        });
                    }
                }
            }
        }
    }
    const parts = header.split(",");
    const selections = [];
    const map = new Set();
    for(let i = 0; i < parts.length; ++i){
        const part = parts[i];
        if (!part) {
            continue;
        }
        const params = part.split(";");
        if (params.length > 2) {
            throw new Error(`Invalid ${options.type} header`);
        }
        let token = params[0].toLowerCase();
        if (!token) {
            throw new Error(`Invalid ${options.type} header`);
        }
        const selection = {
            token,
            pos: i,
            q: 1
        };
        if (preferences && lowers.has(token)) {
            selection.pref = lowers.get(token).pos;
        }
        map.add(selection.token);
        if (params.length === 2) {
            const q = params[1];
            const [key, value] = q.split("=");
            if (!value || key !== "q" && key !== "Q") {
                throw new Error(`Invalid ${options.type} header`);
            }
            const score = parseFloat(value);
            if (score === 0) {
                continue;
            }
            if (Number.isFinite(score) && score <= 1 && score >= 0.001) {
                selection.q = score;
            }
        }
        selections.push(selection);
    }
    selections.sort((a, b)=>{
        if (b.q !== a.q) {
            return b.q - a.q;
        }
        if (b.pref !== a.pref) {
            if (a.pref === undefined) {
                return 1;
            }
            if (b.pref === undefined) {
                return -1;
            }
            return a.pref - b.pref;
        }
        return a.pos - b.pos;
    });
    const values = selections.map((selection)=>selection.token);
    if (!preferences || !preferences.length) {
        return values;
    }
    const preferred = [];
    for (const selection of values){
        if (selection === "*") {
            for (const [preference, value] of lowers){
                if (!map.has(preference)) {
                    preferred.push(value.orig);
                }
            }
        } else {
            const lower = selection.toLowerCase();
            if (lowers.has(lower)) {
                preferred.push(lowers.get(lower).orig);
            }
        }
    }
    return preferred;
}
function acceptLanguage(header = "", preferences) {
    return parse(header, preferences, {
        type: "accept-language",
        prefixMatch: true
    })[0] || "";
} //# sourceMappingURL=accept-header.js.map


/***/ }),

/***/ 50515:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*

Files in the rsc directory are meant to be packaged as part of the RSC graph using next-app-loader.

*/ 
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
    preloadStyle: function() {
        return preloadStyle;
    },
    preloadFont: function() {
        return preloadFont;
    },
    preconnect: function() {
        return preconnect;
    }
});
const _reactdom = /*#__PURE__*/ _interop_require_default(__webpack_require__(3592));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const stylePreloadOptions = {
    as: "style"
};
function preloadStyle(href) {
    _reactdom.default.preload(href, stylePreloadOptions);
}
function preloadFont(href, type) {
    _reactdom.default.preload(href, {
        as: "font",
        type
    });
}
function preconnect(href, crossOrigin) {
    if (typeof crossOrigin === "string") {
        _reactdom.default.preconnect(href, {
            crossOrigin
        });
    } else {
        _reactdom.default.preconnect(href);
    }
} //# sourceMappingURL=preloads.js.map


/***/ }),

/***/ 96888:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
    INTERCEPTION_ROUTE_MARKERS: function() {
        return INTERCEPTION_ROUTE_MARKERS;
    },
    isInterceptionRouteAppPath: function() {
        return isInterceptionRouteAppPath;
    },
    extractInterceptionRouteInformation: function() {
        return extractInterceptionRouteInformation;
    }
});
const _apppaths = __webpack_require__(38798);
const INTERCEPTION_ROUTE_MARKERS = [
    "(..)(..)",
    "(.)",
    "(..)",
    "(...)"
];
function isInterceptionRouteAppPath(path) {
    // TODO-APP: add more serious validation
    return path.split("/").find((segment)=>INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m))) !== undefined;
}
function extractInterceptionRouteInformation(path) {
    let interceptingRoute, marker, interceptedRoute;
    for (const segment of path.split("/")){
        marker = INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m));
        if (marker) {
            [interceptingRoute, interceptedRoute] = path.split(marker, 2);
            break;
        }
    }
    if (!interceptingRoute || !marker || !interceptedRoute) {
        throw new Error(`Invalid interception route: ${path}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`);
    }
    interceptingRoute = (0, _apppaths.normalizeAppPath)(interceptingRoute) // normalize the path, e.g. /(blog)/feed -> /feed
    ;
    switch(marker){
        case "(.)":
            // (.) indicates that we should match with sibling routes, so we just need to append the intercepted route to the intercepting route
            if (interceptingRoute === "/") {
                interceptedRoute = `/${interceptedRoute}`;
            } else {
                interceptedRoute = interceptingRoute + "/" + interceptedRoute;
            }
            break;
        case "(..)":
            // (..) indicates that we should match at one level up, so we need to remove the last segment of the intercepting route
            if (interceptingRoute === "/") {
                throw new Error(`Invalid interception route: ${path}. Cannot use (..) marker at the root level, use (.) instead.`);
            }
            interceptedRoute = interceptingRoute.split("/").slice(0, -1).concat(interceptedRoute).join("/");
            break;
        case "(...)":
            // (...) will match the route segment in the root directory, so we need to use the root directory to prepend the intercepted route
            interceptedRoute = "/" + interceptedRoute;
            break;
        case "(..)(..)":
            // (..)(..) indicates that we should match at two levels up, so we need to remove the last two segments of the intercepting route
            const splitInterceptingRoute = interceptingRoute.split("/");
            if (splitInterceptingRoute.length <= 2) {
                throw new Error(`Invalid interception route: ${path}. Cannot use (..)(..) marker at the root level or one level up.`);
            }
            interceptedRoute = splitInterceptingRoute.slice(0, -2).concat(interceptedRoute).join("/");
            break;
        default:
            throw new Error("Invariant: unexpected marker");
    }
    return {
        interceptingRoute,
        interceptedRoute
    };
} //# sourceMappingURL=interception-routes.js.map


/***/ }),

/***/ 1191:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/* eslint-disable no-redeclare */ 
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
    NEXT_REQUEST_META: function() {
        return NEXT_REQUEST_META;
    },
    getRequestMeta: function() {
        return getRequestMeta;
    },
    setRequestMeta: function() {
        return setRequestMeta;
    },
    addRequestMeta: function() {
        return addRequestMeta;
    },
    getNextInternalQuery: function() {
        return getNextInternalQuery;
    }
});
const NEXT_REQUEST_META = Symbol.for("NextInternalRequestMeta");
function getRequestMeta(req, key) {
    const meta = req[NEXT_REQUEST_META] || {};
    return typeof key === "string" ? meta[key] : meta;
}
function setRequestMeta(req, meta) {
    req[NEXT_REQUEST_META] = meta;
    return getRequestMeta(req);
}
function addRequestMeta(request, key, value) {
    const meta = getRequestMeta(request);
    meta[key] = value;
    return setRequestMeta(request, meta);
}
function getNextInternalQuery(query) {
    const keysToInclude = [
        "__nextDefaultLocale",
        "__nextFallback",
        "__nextLocale",
        "__nextSsgPath",
        "_nextBubbleNoFallback",
        "__nextDataReq",
        "__nextInferredLocaleFromDefault"
    ];
    const nextInternalQuery = {};
    for (const key of keysToInclude){
        if (key in query) {
            // @ts-ignore this can't be typed correctly
            nextInternalQuery[key] = query[key];
        }
    }
    return nextInternalQuery;
} //# sourceMappingURL=request-meta.js.map


/***/ }),

/***/ 20459:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
    normalizeVercelUrl: function() {
        return normalizeVercelUrl;
    },
    interpolateDynamicPath: function() {
        return interpolateDynamicPath;
    },
    getUtils: function() {
        return getUtils;
    }
});
const _url = __webpack_require__(57310);
const _normalizelocalepath = __webpack_require__(49959);
const _pathmatch = __webpack_require__(61819);
const _routeregex = __webpack_require__(1937);
const _routematcher = __webpack_require__(22063);
const _preparedestination = __webpack_require__(30316);
const _acceptheader = __webpack_require__(47939);
const _detectlocalecookie = __webpack_require__(25319);
const _detectdomainlocale = __webpack_require__(55490);
const _denormalizepagepath = __webpack_require__(18547);
const _cookie = /*#__PURE__*/ _interop_require_default(__webpack_require__(40252));
const _constants = __webpack_require__(66024);
const _requestmeta = __webpack_require__(1191);
const _removetrailingslash = __webpack_require__(98454);
const _apppaths = __webpack_require__(38798);
const _constants1 = __webpack_require__(72523);
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function normalizeVercelUrl(req, trustQuery, paramKeys, pageIsDynamic, defaultRouteRegex) {
    // make sure to normalize req.url on Vercel to strip dynamic params
    // from the query which are added during routing
    if (pageIsDynamic && trustQuery && defaultRouteRegex) {
        const _parsedUrl = (0, _url.parse)(req.url, true);
        delete _parsedUrl.search;
        for (const key of Object.keys(_parsedUrl.query)){
            if (key !== _constants1.NEXT_QUERY_PARAM_PREFIX && key.startsWith(_constants1.NEXT_QUERY_PARAM_PREFIX) || (paramKeys || Object.keys(defaultRouteRegex.groups)).includes(key)) {
                delete _parsedUrl.query[key];
            }
        }
        req.url = (0, _url.format)(_parsedUrl);
    }
}
function interpolateDynamicPath(pathname, params, defaultRouteRegex) {
    if (!defaultRouteRegex) return pathname;
    for (const param of Object.keys(defaultRouteRegex.groups)){
        const { optional , repeat  } = defaultRouteRegex.groups[param];
        let builtParam = `[${repeat ? "..." : ""}${param}]`;
        if (optional) {
            builtParam = `[${builtParam}]`;
        }
        const paramIdx = pathname.indexOf(builtParam);
        if (paramIdx > -1) {
            let paramValue;
            const value = params[param];
            if (Array.isArray(value)) {
                paramValue = value.map((v)=>v && encodeURIComponent(v)).join("/");
            } else if (value) {
                paramValue = encodeURIComponent(value);
            } else {
                paramValue = "";
            }
            pathname = pathname.slice(0, paramIdx) + paramValue + pathname.slice(paramIdx + builtParam.length);
        }
    }
    return pathname;
}
function getUtils({ page , i18n , basePath , rewrites , pageIsDynamic , trailingSlash  }) {
    let defaultRouteRegex;
    let dynamicRouteMatcher;
    let defaultRouteMatches;
    if (pageIsDynamic) {
        defaultRouteRegex = (0, _routeregex.getNamedRouteRegex)(page, false);
        dynamicRouteMatcher = (0, _routematcher.getRouteMatcher)(defaultRouteRegex);
        defaultRouteMatches = dynamicRouteMatcher(page);
    }
    function handleRewrites(req, parsedUrl) {
        const rewriteParams = {};
        let fsPathname = parsedUrl.pathname;
        const matchesPage = ()=>{
            const fsPathnameNoSlash = (0, _removetrailingslash.removeTrailingSlash)(fsPathname || "");
            return fsPathnameNoSlash === (0, _removetrailingslash.removeTrailingSlash)(page) || (dynamicRouteMatcher == null ? void 0 : dynamicRouteMatcher(fsPathnameNoSlash));
        };
        const checkRewrite = (rewrite)=>{
            const matcher = (0, _pathmatch.getPathMatch)(rewrite.source + (trailingSlash ? "(/)?" : ""), {
                removeUnnamedParams: true,
                strict: true
            });
            let params = matcher(parsedUrl.pathname);
            if ((rewrite.has || rewrite.missing) && params) {
                const hasParams = (0, _preparedestination.matchHas)(req, parsedUrl.query, rewrite.has, rewrite.missing);
                if (hasParams) {
                    Object.assign(params, hasParams);
                } else {
                    params = false;
                }
            }
            if (params) {
                const { parsedDestination , destQuery  } = (0, _preparedestination.prepareDestination)({
                    appendParamsToQuery: true,
                    destination: rewrite.destination,
                    params: params,
                    query: parsedUrl.query
                });
                // if the rewrite destination is external break rewrite chain
                if (parsedDestination.protocol) {
                    return true;
                }
                Object.assign(rewriteParams, destQuery, params);
                Object.assign(parsedUrl.query, parsedDestination.query);
                delete parsedDestination.query;
                Object.assign(parsedUrl, parsedDestination);
                fsPathname = parsedUrl.pathname;
                if (basePath) {
                    fsPathname = fsPathname.replace(new RegExp(`^${basePath}`), "") || "/";
                }
                if (i18n) {
                    const destLocalePathResult = (0, _normalizelocalepath.normalizeLocalePath)(fsPathname, i18n.locales);
                    fsPathname = destLocalePathResult.pathname;
                    parsedUrl.query.nextInternalLocale = destLocalePathResult.detectedLocale || params.nextInternalLocale;
                }
                if (fsPathname === page) {
                    return true;
                }
                if (pageIsDynamic && dynamicRouteMatcher) {
                    const dynamicParams = dynamicRouteMatcher(fsPathname);
                    if (dynamicParams) {
                        parsedUrl.query = {
                            ...parsedUrl.query,
                            ...dynamicParams
                        };
                        return true;
                    }
                }
            }
            return false;
        };
        for (const rewrite of rewrites.beforeFiles || []){
            checkRewrite(rewrite);
        }
        if (fsPathname !== page) {
            let finished = false;
            for (const rewrite of rewrites.afterFiles || []){
                finished = checkRewrite(rewrite);
                if (finished) break;
            }
            if (!finished && !matchesPage()) {
                for (const rewrite of rewrites.fallback || []){
                    finished = checkRewrite(rewrite);
                    if (finished) break;
                }
            }
        }
        return rewriteParams;
    }
    function handleBasePath(req, parsedUrl) {
        // always strip the basePath if configured since it is required
        req.url = req.url.replace(new RegExp(`^${basePath}`), "") || "/";
        parsedUrl.pathname = parsedUrl.pathname.replace(new RegExp(`^${basePath}`), "") || "/";
    }
    function getParamsFromRouteMatches(req, renderOpts, detectedLocale) {
        return (0, _routematcher.getRouteMatcher)(function() {
            const { groups , routeKeys  } = defaultRouteRegex;
            return {
                re: {
                    // Simulate a RegExp match from the \`req.url\` input
                    exec: (str)=>{
                        const obj = Object.fromEntries(new URLSearchParams(str));
                        const matchesHasLocale = i18n && detectedLocale && obj["1"] === detectedLocale;
                        for (const key of Object.keys(obj)){
                            const value = obj[key];
                            if (key !== _constants1.NEXT_QUERY_PARAM_PREFIX && key.startsWith(_constants1.NEXT_QUERY_PARAM_PREFIX)) {
                                const normalizedKey = key.substring(_constants1.NEXT_QUERY_PARAM_PREFIX.length);
                                obj[normalizedKey] = value;
                                delete obj[key];
                            }
                        }
                        // favor named matches if available
                        const routeKeyNames = Object.keys(routeKeys || {});
                        const filterLocaleItem = (val)=>{
                            if (i18n) {
                                // locale items can be included in route-matches
                                // for fallback SSG pages so ensure they are
                                // filtered
                                const isCatchAll = Array.isArray(val);
                                const _val = isCatchAll ? val[0] : val;
                                if (typeof _val === "string" && i18n.locales.some((item)=>{
                                    if (item.toLowerCase() === _val.toLowerCase()) {
                                        detectedLocale = item;
                                        renderOpts.locale = detectedLocale;
                                        return true;
                                    }
                                    return false;
                                })) {
                                    // remove the locale item from the match
                                    if (isCatchAll) {
                                        val.splice(0, 1);
                                    }
                                    // the value is only a locale item and
                                    // shouldn't be added
                                    return isCatchAll ? val.length === 0 : true;
                                }
                            }
                            return false;
                        };
                        if (routeKeyNames.every((name)=>obj[name])) {
                            return routeKeyNames.reduce((prev, keyName)=>{
                                const paramName = routeKeys == null ? void 0 : routeKeys[keyName];
                                if (paramName && !filterLocaleItem(obj[keyName])) {
                                    prev[groups[paramName].pos] = obj[keyName];
                                }
                                return prev;
                            }, {});
                        }
                        return Object.keys(obj).reduce((prev, key)=>{
                            if (!filterLocaleItem(obj[key])) {
                                let normalizedKey = key;
                                if (matchesHasLocale) {
                                    normalizedKey = parseInt(key, 10) - 1 + "";
                                }
                                return Object.assign(prev, {
                                    [normalizedKey]: obj[key]
                                });
                            }
                            return prev;
                        }, {});
                    }
                },
                groups
            };
        }())(req.headers["x-now-route-matches"]);
    }
    function normalizeDynamicRouteParams(params, ignoreOptional) {
        let hasValidParams = true;
        if (!defaultRouteRegex) return {
            params,
            hasValidParams: false
        };
        params = Object.keys(defaultRouteRegex.groups).reduce((prev, key)=>{
            let value = params[key];
            if (typeof value === "string") {
                value = (0, _apppaths.normalizeRscPath)(value, true);
            }
            if (Array.isArray(value)) {
                value = value.map((val)=>{
                    if (typeof val === "string") {
                        val = (0, _apppaths.normalizeRscPath)(val, true);
                    }
                    return val;
                });
            }
            // if the value matches the default value we can't rely
            // on the parsed params, this is used to signal if we need
            // to parse x-now-route-matches or not
            const defaultValue = defaultRouteMatches[key];
            const isOptional = defaultRouteRegex.groups[key].optional;
            const isDefaultValue = Array.isArray(defaultValue) ? defaultValue.some((defaultVal)=>{
                return Array.isArray(value) ? value.some((val)=>val.includes(defaultVal)) : value == null ? void 0 : value.includes(defaultVal);
            }) : value == null ? void 0 : value.includes(defaultValue);
            if (isDefaultValue || typeof value === "undefined" && !(isOptional && ignoreOptional)) {
                hasValidParams = false;
            }
            // non-provided optional values should be undefined so normalize
            // them to undefined
            if (isOptional && (!value || Array.isArray(value) && value.length === 1 && // fallback optional catch-all SSG pages have
            // [[...paramName]] for the root path on Vercel
            (value[0] === "index" || value[0] === `[[...${key}]]`))) {
                value = undefined;
                delete params[key];
            }
            // query values from the proxy aren't already split into arrays
            // so make sure to normalize catch-all values
            if (value && typeof value === "string" && defaultRouteRegex.groups[key].repeat) {
                value = value.split("/");
            }
            if (value) {
                prev[key] = value;
            }
            return prev;
        }, {});
        return {
            params,
            hasValidParams
        };
    }
    function handleLocale(req, res, parsedUrl, routeNoAssetPath, shouldNotRedirect) {
        if (!i18n) return;
        const pathname = parsedUrl.pathname || "/";
        let defaultLocale = i18n.defaultLocale;
        let detectedLocale = (0, _detectlocalecookie.detectLocaleCookie)(req, i18n.locales);
        let acceptPreferredLocale;
        try {
            acceptPreferredLocale = i18n.localeDetection !== false ? (0, _acceptheader.acceptLanguage)(req.headers["accept-language"], i18n.locales) : detectedLocale;
        } catch (_) {
            acceptPreferredLocale = detectedLocale;
        }
        const { host  } = req.headers || {};
        // remove port from host and remove port if present
        const hostname = host && host.split(":")[0].toLowerCase();
        const detectedDomain = (0, _detectdomainlocale.detectDomainLocale)(i18n.domains, hostname);
        if (detectedDomain) {
            defaultLocale = detectedDomain.defaultLocale;
            detectedLocale = defaultLocale;
            (0, _requestmeta.addRequestMeta)(req, "__nextIsLocaleDomain", true);
        }
        // if not domain specific locale use accept-language preferred
        detectedLocale = detectedLocale || acceptPreferredLocale;
        let localeDomainRedirect;
        const localePathResult = (0, _normalizelocalepath.normalizeLocalePath)(pathname, i18n.locales);
        routeNoAssetPath = (0, _normalizelocalepath.normalizeLocalePath)(routeNoAssetPath, i18n.locales).pathname;
        if (localePathResult.detectedLocale) {
            detectedLocale = localePathResult.detectedLocale;
            req.url = (0, _url.format)({
                ...parsedUrl,
                pathname: localePathResult.pathname
            });
            (0, _requestmeta.addRequestMeta)(req, "__nextStrippedLocale", true);
            parsedUrl.pathname = localePathResult.pathname;
        }
        // If a detected locale is a domain specific locale and we aren't already
        // on that domain and path prefix redirect to it to prevent duplicate
        // content from multiple domains
        if (detectedDomain) {
            const localeToCheck = localePathResult.detectedLocale ? detectedLocale : acceptPreferredLocale;
            const matchedDomain = (0, _detectdomainlocale.detectDomainLocale)(i18n.domains, undefined, localeToCheck);
            if (matchedDomain && matchedDomain.domain !== detectedDomain.domain) {
                localeDomainRedirect = `http${matchedDomain.http ? "" : "s"}://${matchedDomain.domain}/${localeToCheck === matchedDomain.defaultLocale ? "" : localeToCheck}`;
            }
        }
        const denormalizedPagePath = (0, _denormalizepagepath.denormalizePagePath)(pathname);
        const detectedDefaultLocale = !detectedLocale || detectedLocale.toLowerCase() === defaultLocale.toLowerCase();
        const shouldStripDefaultLocale = false;
        // detectedDefaultLocale &&
        // denormalizedPagePath.toLowerCase() === \`/\${i18n.defaultLocale.toLowerCase()}\`
        const shouldAddLocalePrefix = !detectedDefaultLocale && denormalizedPagePath === "/";
        detectedLocale = detectedLocale || i18n.defaultLocale;
        if (!shouldNotRedirect && !req.headers["x-vercel-id"] && i18n.localeDetection !== false && (localeDomainRedirect || shouldAddLocalePrefix || shouldStripDefaultLocale)) {
            // set the NEXT_LOCALE cookie when a user visits the default locale
            // with the locale prefix so that they aren't redirected back to
            // their accept-language preferred locale
            if (shouldStripDefaultLocale && acceptPreferredLocale !== defaultLocale) {
                const previous = res.getHeader("set-cookie");
                res.setHeader("set-cookie", [
                    ...typeof previous === "string" ? [
                        previous
                    ] : Array.isArray(previous) ? previous : [],
                    _cookie.default.serialize("NEXT_LOCALE", defaultLocale, {
                        httpOnly: true,
                        path: "/"
                    })
                ]);
            }
            res.setHeader("Location", (0, _url.format)({
                // make sure to include any query values when redirecting
                ...parsedUrl,
                pathname: localeDomainRedirect ? localeDomainRedirect : shouldStripDefaultLocale ? basePath || "/" : `${basePath}/${detectedLocale}`
            }));
            res.statusCode = _constants.TEMPORARY_REDIRECT_STATUS;
            res.end();
            return;
        }
        detectedLocale = localePathResult.detectedLocale || detectedDomain && detectedDomain.defaultLocale || defaultLocale;
        return {
            defaultLocale,
            detectedLocale,
            routeNoAssetPath
        };
    }
    return {
        handleLocale,
        handleRewrites,
        handleBasePath,
        defaultRouteRegex,
        dynamicRouteMatcher,
        defaultRouteMatches,
        getParamsFromRouteMatches,
        normalizeDynamicRouteParams,
        normalizeVercelUrl: (req, trustQuery, paramKeys)=>normalizeVercelUrl(req, trustQuery, paramKeys, pageIsDynamic, defaultRouteRegex),
        interpolateDynamicPath: (pathname, params)=>interpolateDynamicPath(pathname, params, defaultRouteRegex)
    };
} //# sourceMappingURL=server-utils.js.map


/***/ }),

/***/ 66024:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

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
    MODERN_BROWSERSLIST_TARGET: function() {
        return _modernbrowserslisttarget.default;
    },
    COMPILER_NAMES: function() {
        return COMPILER_NAMES;
    },
    COMPILER_INDEXES: function() {
        return COMPILER_INDEXES;
    },
    PHASE_EXPORT: function() {
        return PHASE_EXPORT;
    },
    PHASE_PRODUCTION_BUILD: function() {
        return PHASE_PRODUCTION_BUILD;
    },
    PHASE_PRODUCTION_SERVER: function() {
        return PHASE_PRODUCTION_SERVER;
    },
    PHASE_DEVELOPMENT_SERVER: function() {
        return PHASE_DEVELOPMENT_SERVER;
    },
    PHASE_TEST: function() {
        return PHASE_TEST;
    },
    PAGES_MANIFEST: function() {
        return PAGES_MANIFEST;
    },
    APP_PATHS_MANIFEST: function() {
        return APP_PATHS_MANIFEST;
    },
    APP_PATH_ROUTES_MANIFEST: function() {
        return APP_PATH_ROUTES_MANIFEST;
    },
    BUILD_MANIFEST: function() {
        return BUILD_MANIFEST;
    },
    APP_BUILD_MANIFEST: function() {
        return APP_BUILD_MANIFEST;
    },
    SUBRESOURCE_INTEGRITY_MANIFEST: function() {
        return SUBRESOURCE_INTEGRITY_MANIFEST;
    },
    NEXT_FONT_MANIFEST: function() {
        return NEXT_FONT_MANIFEST;
    },
    EXPORT_MARKER: function() {
        return EXPORT_MARKER;
    },
    EXPORT_DETAIL: function() {
        return EXPORT_DETAIL;
    },
    PRERENDER_MANIFEST: function() {
        return PRERENDER_MANIFEST;
    },
    ROUTES_MANIFEST: function() {
        return ROUTES_MANIFEST;
    },
    IMAGES_MANIFEST: function() {
        return IMAGES_MANIFEST;
    },
    SERVER_FILES_MANIFEST: function() {
        return SERVER_FILES_MANIFEST;
    },
    DEV_CLIENT_PAGES_MANIFEST: function() {
        return DEV_CLIENT_PAGES_MANIFEST;
    },
    MIDDLEWARE_MANIFEST: function() {
        return MIDDLEWARE_MANIFEST;
    },
    DEV_MIDDLEWARE_MANIFEST: function() {
        return DEV_MIDDLEWARE_MANIFEST;
    },
    REACT_LOADABLE_MANIFEST: function() {
        return REACT_LOADABLE_MANIFEST;
    },
    FONT_MANIFEST: function() {
        return FONT_MANIFEST;
    },
    SERVER_DIRECTORY: function() {
        return SERVER_DIRECTORY;
    },
    CONFIG_FILES: function() {
        return CONFIG_FILES;
    },
    BUILD_ID_FILE: function() {
        return BUILD_ID_FILE;
    },
    BLOCKED_PAGES: function() {
        return BLOCKED_PAGES;
    },
    CLIENT_PUBLIC_FILES_PATH: function() {
        return CLIENT_PUBLIC_FILES_PATH;
    },
    CLIENT_STATIC_FILES_PATH: function() {
        return CLIENT_STATIC_FILES_PATH;
    },
    CLIENT_STATIC_FILES_RUNTIME: function() {
        return CLIENT_STATIC_FILES_RUNTIME;
    },
    STRING_LITERAL_DROP_BUNDLE: function() {
        return STRING_LITERAL_DROP_BUNDLE;
    },
    NEXT_BUILTIN_DOCUMENT: function() {
        return NEXT_BUILTIN_DOCUMENT;
    },
    NEXT_CLIENT_SSR_ENTRY_SUFFIX: function() {
        return NEXT_CLIENT_SSR_ENTRY_SUFFIX;
    },
    CLIENT_REFERENCE_MANIFEST: function() {
        return CLIENT_REFERENCE_MANIFEST;
    },
    FLIGHT_SERVER_CSS_MANIFEST: function() {
        return FLIGHT_SERVER_CSS_MANIFEST;
    },
    SERVER_REFERENCE_MANIFEST: function() {
        return SERVER_REFERENCE_MANIFEST;
    },
    MIDDLEWARE_BUILD_MANIFEST: function() {
        return MIDDLEWARE_BUILD_MANIFEST;
    },
    MIDDLEWARE_REACT_LOADABLE_MANIFEST: function() {
        return MIDDLEWARE_REACT_LOADABLE_MANIFEST;
    },
    CLIENT_STATIC_FILES_RUNTIME_MAIN: function() {
        return CLIENT_STATIC_FILES_RUNTIME_MAIN;
    },
    CLIENT_STATIC_FILES_RUNTIME_MAIN_APP: function() {
        return CLIENT_STATIC_FILES_RUNTIME_MAIN_APP;
    },
    APP_CLIENT_INTERNALS: function() {
        return APP_CLIENT_INTERNALS;
    },
    CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH: function() {
        return CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH;
    },
    CLIENT_STATIC_FILES_RUNTIME_AMP: function() {
        return CLIENT_STATIC_FILES_RUNTIME_AMP;
    },
    CLIENT_STATIC_FILES_RUNTIME_WEBPACK: function() {
        return CLIENT_STATIC_FILES_RUNTIME_WEBPACK;
    },
    CLIENT_STATIC_FILES_RUNTIME_POLYFILLS: function() {
        return CLIENT_STATIC_FILES_RUNTIME_POLYFILLS;
    },
    CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL: function() {
        return CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL;
    },
    EDGE_RUNTIME_WEBPACK: function() {
        return EDGE_RUNTIME_WEBPACK;
    },
    TEMPORARY_REDIRECT_STATUS: function() {
        return TEMPORARY_REDIRECT_STATUS;
    },
    PERMANENT_REDIRECT_STATUS: function() {
        return PERMANENT_REDIRECT_STATUS;
    },
    STATIC_PROPS_ID: function() {
        return STATIC_PROPS_ID;
    },
    SERVER_PROPS_ID: function() {
        return SERVER_PROPS_ID;
    },
    PAGE_SEGMENT_KEY: function() {
        return PAGE_SEGMENT_KEY;
    },
    GOOGLE_FONT_PROVIDER: function() {
        return GOOGLE_FONT_PROVIDER;
    },
    OPTIMIZED_FONT_PROVIDERS: function() {
        return OPTIMIZED_FONT_PROVIDERS;
    },
    DEFAULT_SERIF_FONT: function() {
        return DEFAULT_SERIF_FONT;
    },
    DEFAULT_SANS_SERIF_FONT: function() {
        return DEFAULT_SANS_SERIF_FONT;
    },
    STATIC_STATUS_PAGES: function() {
        return STATIC_STATUS_PAGES;
    },
    TRACE_OUTPUT_VERSION: function() {
        return TRACE_OUTPUT_VERSION;
    },
    TURBO_TRACE_DEFAULT_MEMORY_LIMIT: function() {
        return TURBO_TRACE_DEFAULT_MEMORY_LIMIT;
    },
    RSC_MODULE_TYPES: function() {
        return RSC_MODULE_TYPES;
    },
    EDGE_UNSUPPORTED_NODE_APIS: function() {
        return EDGE_UNSUPPORTED_NODE_APIS;
    },
    SYSTEM_ENTRYPOINTS: function() {
        return SYSTEM_ENTRYPOINTS;
    }
});
const _interop_require_default = __webpack_require__(29140);
const _modernbrowserslisttarget = /*#__PURE__*/ _interop_require_default._(__webpack_require__(69123));
const COMPILER_NAMES = {
    client: "client",
    server: "server",
    edgeServer: "edge-server"
};
const COMPILER_INDEXES = {
    [COMPILER_NAMES.client]: 0,
    [COMPILER_NAMES.server]: 1,
    [COMPILER_NAMES.edgeServer]: 2
};
const PHASE_EXPORT = "phase-export";
const PHASE_PRODUCTION_BUILD = "phase-production-build";
const PHASE_PRODUCTION_SERVER = "phase-production-server";
const PHASE_DEVELOPMENT_SERVER = "phase-development-server";
const PHASE_TEST = "phase-test";
const PAGES_MANIFEST = "pages-manifest.json";
const APP_PATHS_MANIFEST = "app-paths-manifest.json";
const APP_PATH_ROUTES_MANIFEST = "app-path-routes-manifest.json";
const BUILD_MANIFEST = "build-manifest.json";
const APP_BUILD_MANIFEST = "app-build-manifest.json";
const SUBRESOURCE_INTEGRITY_MANIFEST = "subresource-integrity-manifest";
const NEXT_FONT_MANIFEST = "next-font-manifest";
const EXPORT_MARKER = "export-marker.json";
const EXPORT_DETAIL = "export-detail.json";
const PRERENDER_MANIFEST = "prerender-manifest.json";
const ROUTES_MANIFEST = "routes-manifest.json";
const IMAGES_MANIFEST = "images-manifest.json";
const SERVER_FILES_MANIFEST = "required-server-files.json";
const DEV_CLIENT_PAGES_MANIFEST = "_devPagesManifest.json";
const MIDDLEWARE_MANIFEST = "middleware-manifest.json";
const DEV_MIDDLEWARE_MANIFEST = "_devMiddlewareManifest.json";
const REACT_LOADABLE_MANIFEST = "react-loadable-manifest.json";
const FONT_MANIFEST = "font-manifest.json";
const SERVER_DIRECTORY = "server";
const CONFIG_FILES = [
    "next.config.js",
    "next.config.mjs"
];
const BUILD_ID_FILE = "BUILD_ID";
const BLOCKED_PAGES = [
    "/_document",
    "/_app",
    "/_error"
];
const CLIENT_PUBLIC_FILES_PATH = "public";
const CLIENT_STATIC_FILES_PATH = "static";
const CLIENT_STATIC_FILES_RUNTIME = "runtime";
const STRING_LITERAL_DROP_BUNDLE = "__NEXT_DROP_CLIENT_FILE__";
const NEXT_BUILTIN_DOCUMENT = "__NEXT_BUILTIN_DOCUMENT__";
const NEXT_CLIENT_SSR_ENTRY_SUFFIX = ".__sc_client__";
const CLIENT_REFERENCE_MANIFEST = "client-reference-manifest";
const FLIGHT_SERVER_CSS_MANIFEST = "flight-server-css-manifest";
const SERVER_REFERENCE_MANIFEST = "server-reference-manifest";
const MIDDLEWARE_BUILD_MANIFEST = "middleware-build-manifest";
const MIDDLEWARE_REACT_LOADABLE_MANIFEST = "middleware-react-loadable-manifest";
const CLIENT_STATIC_FILES_RUNTIME_MAIN = "main";
const CLIENT_STATIC_FILES_RUNTIME_MAIN_APP = "" + CLIENT_STATIC_FILES_RUNTIME_MAIN + "-app";
const APP_CLIENT_INTERNALS = "app-client-internals";
const CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH = "react-refresh";
const CLIENT_STATIC_FILES_RUNTIME_AMP = "amp";
const CLIENT_STATIC_FILES_RUNTIME_WEBPACK = "webpack";
const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS = "polyfills";
const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL = Symbol(CLIENT_STATIC_FILES_RUNTIME_POLYFILLS);
const EDGE_RUNTIME_WEBPACK = "edge-runtime-webpack";
const TEMPORARY_REDIRECT_STATUS = 307;
const PERMANENT_REDIRECT_STATUS = 308;
const STATIC_PROPS_ID = "__N_SSG";
const SERVER_PROPS_ID = "__N_SSP";
const PAGE_SEGMENT_KEY = "__PAGE__";
const GOOGLE_FONT_PROVIDER = "https://fonts.googleapis.com/";
const OPTIMIZED_FONT_PROVIDERS = [
    {
        url: GOOGLE_FONT_PROVIDER,
        preconnect: "https://fonts.gstatic.com"
    },
    {
        url: "https://use.typekit.net",
        preconnect: "https://use.typekit.net"
    }
];
const DEFAULT_SERIF_FONT = {
    name: "Times New Roman",
    xAvgCharWidth: 821,
    azAvgWidth: 854.3953488372093,
    unitsPerEm: 2048
};
const DEFAULT_SANS_SERIF_FONT = {
    name: "Arial",
    xAvgCharWidth: 904,
    azAvgWidth: 934.5116279069767,
    unitsPerEm: 2048
};
const STATIC_STATUS_PAGES = [
    "/500"
];
const TRACE_OUTPUT_VERSION = 1;
const TURBO_TRACE_DEFAULT_MEMORY_LIMIT = 6000;
const RSC_MODULE_TYPES = {
    client: "client",
    server: "server"
};
const EDGE_UNSUPPORTED_NODE_APIS = [
    "clearImmediate",
    "setImmediate",
    "BroadcastChannel",
    "ByteLengthQueuingStrategy",
    "CompressionStream",
    "CountQueuingStrategy",
    "DecompressionStream",
    "DomException",
    "MessageChannel",
    "MessageEvent",
    "MessagePort",
    "ReadableByteStreamController",
    "ReadableStreamBYOBRequest",
    "ReadableStreamDefaultController",
    "TransformStreamDefaultController",
    "WritableStreamDefaultController"
];
const SYSTEM_ENTRYPOINTS = new Set([
    CLIENT_STATIC_FILES_RUNTIME_MAIN,
    CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH,
    CLIENT_STATIC_FILES_RUNTIME_AMP,
    CLIENT_STATIC_FILES_RUNTIME_MAIN_APP
]);
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=constants.js.map


/***/ }),

/***/ 22431:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
// regexp is based on https://github.com/sindresorhus/escape-string-regexp

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "escapeStringRegexp", ({
    enumerable: true,
    get: function() {
        return escapeStringRegexp;
    }
}));
const reHasRegExp = /[|\\{}()[\]^$+*?.-]/;
const reReplaceRegExp = /[|\\{}()[\]^$+*?.-]/g;
function escapeStringRegexp(str) {
    // see also: https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/escapeRegExp.js#L23
    if (reHasRegExp.test(str)) {
        return str.replace(reReplaceRegExp, "\\$&");
    }
    return str;
} //# sourceMappingURL=escape-regexp.js.map


/***/ }),

/***/ 19809:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
// http://www.cse.yorku.ca/~oz/hash.html

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "djb2Hash", ({
    enumerable: true,
    get: function() {
        return djb2Hash;
    }
}));
function djb2Hash(str) {
    let hash = 5381;
    for(let i = 0; i < str.length; i++){
        const char = str.charCodeAt(i);
        hash = (hash << 5) + hash + char;
    }
    return Math.abs(hash);
} //# sourceMappingURL=hash.js.map


/***/ }),

/***/ 25319:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "detectLocaleCookie", ({
    enumerable: true,
    get: function() {
        return detectLocaleCookie;
    }
}));
function detectLocaleCookie(req, locales) {
    const { NEXT_LOCALE  } = req.cookies || {};
    return NEXT_LOCALE ? locales.find((locale)=>NEXT_LOCALE.toLowerCase() === locale.toLowerCase()) : undefined;
} //# sourceMappingURL=detect-locale-cookie.js.map


/***/ }),

/***/ 36764:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * This module is for next.js server internal usage of path module.
 * It will use native path module for nodejs runtime.
 * It will use path-browserify polyfill for edge runtime.
 */ 
let path;
if (false) {} else {
    path = __webpack_require__(71017);
}
module.exports = path; //# sourceMappingURL=path.js.map


/***/ }),

/***/ 69123:
/***/ ((module) => {

"use strict";
// Note: This file is JS because it's used by the taskfile-swc.js file, which is JS.
// Keep file changes in sync with the corresponding `.d.ts` files.
/**
 * These are the browser versions that support all of the following:
 * static import: https://caniuse.com/es6-module
 * dynamic import: https://caniuse.com/es6-module-dynamic-import
 * import.meta: https://caniuse.com/mdn-javascript_operators_import_meta
 */ 
const MODERN_BROWSERSLIST_TARGET = [
    "chrome 64",
    "edge 79",
    "firefox 67",
    "opera 51",
    "safari 12"
];
module.exports = MODERN_BROWSERSLIST_TARGET; //# sourceMappingURL=modern-browserslist-target.js.map


/***/ }),

/***/ 18547:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "denormalizePagePath", ({
    enumerable: true,
    get: function() {
        return denormalizePagePath;
    }
}));
const _utils = __webpack_require__(77221);
const _normalizepathsep = __webpack_require__(48027);
function denormalizePagePath(page) {
    let _page = (0, _normalizepathsep.normalizePathSep)(page);
    return _page.startsWith("/index/") && !(0, _utils.isDynamicRoute)(_page) ? _page.slice(6) : _page !== "/index" ? _page : "/";
} //# sourceMappingURL=denormalize-page-path.js.map


/***/ }),

/***/ 40528:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/**
 * For a given page path, this function ensures that there is a leading slash.
 * If there is not a leading slash, one is added, otherwise it is noop.
 */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "ensureLeadingSlash", ({
    enumerable: true,
    get: function() {
        return ensureLeadingSlash;
    }
}));
function ensureLeadingSlash(path) {
    return path.startsWith("/") ? path : "/" + path;
} //# sourceMappingURL=ensure-leading-slash.js.map


/***/ }),

/***/ 48027:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/**
 * For a given page path, this function ensures that there is no backslash
 * escaping slashes in the path. Example:
 *  - `foo\/bar\/baz` -> `foo/bar/baz`
 */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "normalizePathSep", ({
    enumerable: true,
    get: function() {
        return normalizePathSep;
    }
}));
function normalizePathSep(path) {
    return path.replace(/\\/g, "/");
} //# sourceMappingURL=normalize-path-sep.js.map


/***/ }),

/***/ 38798:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
    normalizeAppPath: function() {
        return normalizeAppPath;
    },
    normalizeRscPath: function() {
        return normalizeRscPath;
    }
});
const _ensureleadingslash = __webpack_require__(40528);
function normalizeAppPath(route) {
    return (0, _ensureleadingslash.ensureLeadingSlash)(route.split("/").reduce((pathname, segment, index, segments)=>{
        // Empty segments are ignored.
        if (!segment) {
            return pathname;
        }
        // Groups are ignored.
        if (segment.startsWith("(") && segment.endsWith(")")) {
            return pathname;
        }
        // Parallel segments are ignored.
        if (segment.startsWith("@")) {
            return pathname;
        }
        // The last segment (if it's a leaf) should be ignored.
        if ((segment === "page" || segment === "route") && index === segments.length - 1) {
            return pathname;
        }
        return pathname + "/" + segment;
    }, ""));
}
function normalizeRscPath(pathname, enabled) {
    return enabled ? pathname.replace(/\.rsc($|\?)/, "$1") : pathname;
} //# sourceMappingURL=app-paths.js.map


/***/ }),

/***/ 77221:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
    getSortedRoutes: function() {
        return _sortedroutes.getSortedRoutes;
    },
    isDynamicRoute: function() {
        return _isdynamic.isDynamicRoute;
    }
});
const _sortedroutes = __webpack_require__(93762);
const _isdynamic = __webpack_require__(23474); //# sourceMappingURL=index.js.map


/***/ }),

/***/ 23474:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
// Identify /[param]/ in route string

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "isDynamicRoute", ({
    enumerable: true,
    get: function() {
        return isDynamicRoute;
    }
}));
const TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;
function isDynamicRoute(route) {
    return TEST_ROUTE.test(route);
} //# sourceMappingURL=is-dynamic.js.map


/***/ }),

/***/ 41265:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "parseRelativeUrl", ({
    enumerable: true,
    get: function() {
        return parseRelativeUrl;
    }
}));
const _utils = __webpack_require__(78281);
const _querystring = __webpack_require__(48954);
function parseRelativeUrl(url, base) {
    const globalBase = new URL( true ? "http://n" : 0);
    const resolvedBase = base ? new URL(base, globalBase) : url.startsWith(".") ? new URL( true ? "http://n" : 0) : globalBase;
    const { pathname , searchParams , search , hash , href , origin  } = new URL(url, resolvedBase);
    if (origin !== globalBase.origin) {
        throw new Error("invariant: invalid relative URL, router received " + url);
    }
    return {
        pathname,
        query: (0, _querystring.searchParamsToUrlQuery)(searchParams),
        search,
        hash,
        href: href.slice(globalBase.origin.length)
    };
} //# sourceMappingURL=parse-relative-url.js.map


/***/ }),

/***/ 67437:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "parseUrl", ({
    enumerable: true,
    get: function() {
        return parseUrl;
    }
}));
const _querystring = __webpack_require__(48954);
const _parserelativeurl = __webpack_require__(41265);
function parseUrl(url) {
    if (url.startsWith("/")) {
        return (0, _parserelativeurl.parseRelativeUrl)(url);
    }
    const parsedURL = new URL(url);
    return {
        hash: parsedURL.hash,
        hostname: parsedURL.hostname,
        href: parsedURL.href,
        pathname: parsedURL.pathname,
        port: parsedURL.port,
        protocol: parsedURL.protocol,
        query: (0, _querystring.searchParamsToUrlQuery)(parsedURL.searchParams),
        search: parsedURL.search
    };
} //# sourceMappingURL=parse-url.js.map


/***/ }),

/***/ 61819:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getPathMatch", ({
    enumerable: true,
    get: function() {
        return getPathMatch;
    }
}));
const _pathtoregexp = __webpack_require__(97999);
function getPathMatch(path, options) {
    const keys = [];
    const regexp = (0, _pathtoregexp.pathToRegexp)(path, keys, {
        delimiter: "/",
        sensitive: false,
        strict: options == null ? void 0 : options.strict
    });
    const matcher = (0, _pathtoregexp.regexpToFunction)((options == null ? void 0 : options.regexModifier) ? new RegExp(options.regexModifier(regexp.source), regexp.flags) : regexp, keys);
    /**
   * A matcher function that will check if a given pathname matches the path
   * given in the builder function. When the path does not match it will return
   * `false` but if it does it will return an object with the matched params
   * merged with the params provided in the second argument.
   */ return (pathname, params)=>{
        const res = pathname == null ? false : matcher(pathname);
        if (!res) {
            return false;
        }
        /**
     * If unnamed params are not allowed they must be removed from
     * the matched parameters. path-to-regexp uses "string" for named and
     * "number" for unnamed parameters.
     */ if (options == null ? void 0 : options.removeUnnamedParams) {
            for (const key of keys){
                if (typeof key.name === "number") {
                    delete res.params[key.name];
                }
            }
        }
        return {
            ...params,
            ...res.params
        };
    };
} //# sourceMappingURL=path-match.js.map


/***/ }),

/***/ 30316:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
    matchHas: function() {
        return matchHas;
    },
    compileNonPath: function() {
        return compileNonPath;
    },
    prepareDestination: function() {
        return prepareDestination;
    }
});
const _pathtoregexp = __webpack_require__(97999);
const _escaperegexp = __webpack_require__(22431);
const _parseurl = __webpack_require__(67437);
const _interceptionroutes = __webpack_require__(96888);
/**
 * Ensure only a-zA-Z are used for param names for proper interpolating
 * with path-to-regexp
 */ function getSafeParamName(paramName) {
    let newParamName = "";
    for(let i = 0; i < paramName.length; i++){
        const charCode = paramName.charCodeAt(i);
        if (charCode > 64 && charCode < 91 || // A-Z
        charCode > 96 && charCode < 123 // a-z
        ) {
            newParamName += paramName[i];
        }
    }
    return newParamName;
}
function escapeSegment(str, segmentName) {
    return str.replace(new RegExp(":" + (0, _escaperegexp.escapeStringRegexp)(segmentName), "g"), "__ESC_COLON_" + segmentName);
}
function unescapeSegments(str) {
    return str.replace(/__ESC_COLON_/gi, ":");
}
function matchHas(req, query, has, missing) {
    if (has === void 0) has = [];
    if (missing === void 0) missing = [];
    const params = {};
    const hasMatch = (hasItem)=>{
        let value;
        let key = hasItem.key;
        switch(hasItem.type){
            case "header":
                {
                    key = key.toLowerCase();
                    value = req.headers[key];
                    break;
                }
            case "cookie":
                {
                    value = req.cookies[hasItem.key];
                    break;
                }
            case "query":
                {
                    value = query[key];
                    break;
                }
            case "host":
                {
                    const { host  } = (req == null ? void 0 : req.headers) || {};
                    // remove port from host if present
                    const hostname = host == null ? void 0 : host.split(":")[0].toLowerCase();
                    value = hostname;
                    break;
                }
            default:
                {
                    break;
                }
        }
        if (!hasItem.value && value) {
            params[getSafeParamName(key)] = value;
            return true;
        } else if (value) {
            const matcher = new RegExp("^" + hasItem.value + "$");
            const matches = Array.isArray(value) ? value.slice(-1)[0].match(matcher) : value.match(matcher);
            if (matches) {
                if (Array.isArray(matches)) {
                    if (matches.groups) {
                        Object.keys(matches.groups).forEach((groupKey)=>{
                            params[groupKey] = matches.groups[groupKey];
                        });
                    } else if (hasItem.type === "host" && matches[0]) {
                        params.host = matches[0];
                    }
                }
                return true;
            }
        }
        return false;
    };
    const allMatch = has.every((item)=>hasMatch(item)) && !missing.some((item)=>hasMatch(item));
    if (allMatch) {
        return params;
    }
    return false;
}
function compileNonPath(value, params) {
    if (!value.includes(":")) {
        return value;
    }
    for (const key of Object.keys(params)){
        if (value.includes(":" + key)) {
            value = value.replace(new RegExp(":" + key + "\\*", "g"), ":" + key + "--ESCAPED_PARAM_ASTERISKS").replace(new RegExp(":" + key + "\\?", "g"), ":" + key + "--ESCAPED_PARAM_QUESTION").replace(new RegExp(":" + key + "\\+", "g"), ":" + key + "--ESCAPED_PARAM_PLUS").replace(new RegExp(":" + key + "(?!\\w)", "g"), "--ESCAPED_PARAM_COLON" + key);
        }
    }
    value = value.replace(/(:|\*|\?|\+|\(|\)|\{|\})/g, "\\$1").replace(/--ESCAPED_PARAM_PLUS/g, "+").replace(/--ESCAPED_PARAM_COLON/g, ":").replace(/--ESCAPED_PARAM_QUESTION/g, "?").replace(/--ESCAPED_PARAM_ASTERISKS/g, "*");
    // the value needs to start with a forward-slash to be compiled
    // correctly
    return (0, _pathtoregexp.compile)("/" + value, {
        validate: false
    })(params).slice(1);
}
function prepareDestination(args) {
    const query = Object.assign({}, args.query);
    delete query.__nextLocale;
    delete query.__nextDefaultLocale;
    delete query.__nextDataReq;
    delete query.__nextInferredLocaleFromDefault;
    let escapedDestination = args.destination;
    for (const param of Object.keys({
        ...args.params,
        ...query
    })){
        escapedDestination = escapeSegment(escapedDestination, param);
    }
    const parsedDestination = (0, _parseurl.parseUrl)(escapedDestination);
    const destQuery = parsedDestination.query;
    const destPath = unescapeSegments("" + parsedDestination.pathname + (parsedDestination.hash || ""));
    const destHostname = unescapeSegments(parsedDestination.hostname || "");
    const destPathParamKeys = [];
    const destHostnameParamKeys = [];
    (0, _pathtoregexp.pathToRegexp)(destPath, destPathParamKeys);
    (0, _pathtoregexp.pathToRegexp)(destHostname, destHostnameParamKeys);
    const destParams = [];
    destPathParamKeys.forEach((key)=>destParams.push(key.name));
    destHostnameParamKeys.forEach((key)=>destParams.push(key.name));
    const destPathCompiler = (0, _pathtoregexp.compile)(destPath, // have already validated before we got to this point and validating
    // breaks compiling destinations with named pattern params from the source
    // e.g. /something:hello(.*) -> /another/:hello is broken with validation
    // since compile validation is meant for reversing and not for inserting
    // params from a separate path-regex into another
    {
        validate: false
    });
    const destHostnameCompiler = (0, _pathtoregexp.compile)(destHostname, {
        validate: false
    });
    // update any params in query values
    for (const [key, strOrArray] of Object.entries(destQuery)){
        // the value needs to start with a forward-slash to be compiled
        // correctly
        if (Array.isArray(strOrArray)) {
            destQuery[key] = strOrArray.map((value)=>compileNonPath(unescapeSegments(value), args.params));
        } else if (typeof strOrArray === "string") {
            destQuery[key] = compileNonPath(unescapeSegments(strOrArray), args.params);
        }
    }
    // add path params to query if it's not a redirect and not
    // already defined in destination query or path
    let paramKeys = Object.keys(args.params).filter((name)=>name !== "nextInternalLocale");
    if (args.appendParamsToQuery && !paramKeys.some((key)=>destParams.includes(key))) {
        for (const key of paramKeys){
            if (!(key in destQuery)) {
                destQuery[key] = args.params[key];
            }
        }
    }
    let newUrl;
    // The compiler also that the interception route marker is an unnamed param, hence '0',
    // so we need to add it to the params object.
    if ((0, _interceptionroutes.isInterceptionRouteAppPath)(destPath)) {
        for (const segment of destPath.split("/")){
            const marker = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m));
            if (marker) {
                args.params["0"] = marker;
                break;
            }
        }
    }
    try {
        newUrl = destPathCompiler(args.params);
        const [pathname, hash] = newUrl.split("#");
        parsedDestination.hostname = destHostnameCompiler(args.params);
        parsedDestination.pathname = pathname;
        parsedDestination.hash = "" + (hash ? "#" : "") + (hash || "");
        delete parsedDestination.search;
    } catch (err) {
        if (err.message.match(/Expected .*? to not repeat, but got an array/)) {
            throw new Error("To use a multi-match in the destination you must add `*` at the end of the param name to signify it should repeat. https://nextjs.org/docs/messages/invalid-multi-match");
        }
        throw err;
    }
    // Query merge order lowest priority to highest
    // 1. initial URL query values
    // 2. path segment values
    // 3. destination specified query values
    parsedDestination.query = {
        ...query,
        ...parsedDestination.query
    };
    return {
        newUrl,
        destQuery,
        parsedDestination
    };
} //# sourceMappingURL=prepare-destination.js.map


/***/ }),

/***/ 48954:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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
    searchParamsToUrlQuery: function() {
        return searchParamsToUrlQuery;
    },
    urlQueryToSearchParams: function() {
        return urlQueryToSearchParams;
    },
    assign: function() {
        return assign;
    }
});
function searchParamsToUrlQuery(searchParams) {
    const query = {};
    searchParams.forEach((value, key)=>{
        if (typeof query[key] === "undefined") {
            query[key] = value;
        } else if (Array.isArray(query[key])) {
            query[key].push(value);
        } else {
            query[key] = [
                query[key],
                value
            ];
        }
    });
    return query;
}
function stringifyUrlQueryParam(param) {
    if (typeof param === "string" || typeof param === "number" && !isNaN(param) || typeof param === "boolean") {
        return String(param);
    } else {
        return "";
    }
}
function urlQueryToSearchParams(urlQuery) {
    const result = new URLSearchParams();
    Object.entries(urlQuery).forEach((param)=>{
        let [key, value] = param;
        if (Array.isArray(value)) {
            value.forEach((item)=>result.append(key, stringifyUrlQueryParam(item)));
        } else {
            result.set(key, stringifyUrlQueryParam(value));
        }
    });
    return result;
}
function assign(target) {
    for(var _len = arguments.length, searchParamsList = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        searchParamsList[_key - 1] = arguments[_key];
    }
    searchParamsList.forEach((searchParams)=>{
        Array.from(searchParams.keys()).forEach((key)=>target.delete(key));
        searchParams.forEach((value, key)=>target.append(key, value));
    });
    return target;
} //# sourceMappingURL=querystring.js.map


/***/ }),

/***/ 22063:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getRouteMatcher", ({
    enumerable: true,
    get: function() {
        return getRouteMatcher;
    }
}));
const _utils = __webpack_require__(78281);
function getRouteMatcher(param) {
    let { re , groups  } = param;
    return (pathname)=>{
        const routeMatch = re.exec(pathname);
        if (!routeMatch) {
            return false;
        }
        const decode = (param)=>{
            try {
                return decodeURIComponent(param);
            } catch (_) {
                throw new _utils.DecodeError("failed to decode param");
            }
        };
        const params = {};
        Object.keys(groups).forEach((slugName)=>{
            const g = groups[slugName];
            const m = routeMatch[g.pos];
            if (m !== undefined) {
                params[slugName] = ~m.indexOf("/") ? m.split("/").map((entry)=>decode(entry)) : g.repeat ? [
                    decode(m)
                ] : decode(m);
            }
        });
        return params;
    };
} //# sourceMappingURL=route-matcher.js.map


/***/ }),

/***/ 1937:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
    getRouteRegex: function() {
        return getRouteRegex;
    },
    getNamedRouteRegex: function() {
        return getNamedRouteRegex;
    },
    getNamedMiddlewareRegex: function() {
        return getNamedMiddlewareRegex;
    }
});
const _escaperegexp = __webpack_require__(22431);
const _removetrailingslash = __webpack_require__(98454);
const NEXT_QUERY_PARAM_PREFIX = "nxtP";
/**
 * Parses a given parameter from a route to a data structure that can be used
 * to generate the parametrized route. Examples:
 *   - `[...slug]` -> `{ key: 'slug', repeat: true, optional: true }`
 *   - `...slug` -> `{ key: 'slug', repeat: true, optional: false }`
 *   - `[foo]` -> `{ key: 'foo', repeat: false, optional: true }`
 *   - `bar` -> `{ key: 'bar', repeat: false, optional: false }`
 */ function parseParameter(param) {
    const optional = param.startsWith("[") && param.endsWith("]");
    if (optional) {
        param = param.slice(1, -1);
    }
    const repeat = param.startsWith("...");
    if (repeat) {
        param = param.slice(3);
    }
    return {
        key: param,
        repeat,
        optional
    };
}
function getParametrizedRoute(route) {
    const segments = (0, _removetrailingslash.removeTrailingSlash)(route).slice(1).split("/");
    const groups = {};
    let groupIndex = 1;
    return {
        parameterizedRoute: segments.map((segment)=>{
            if (segment.startsWith("[") && segment.endsWith("]")) {
                const { key , optional , repeat  } = parseParameter(segment.slice(1, -1));
                groups[key] = {
                    pos: groupIndex++,
                    repeat,
                    optional
                };
                return repeat ? optional ? "(?:/(.+?))?" : "/(.+?)" : "/([^/]+?)";
            } else {
                return "/" + (0, _escaperegexp.escapeStringRegexp)(segment);
            }
        }).join(""),
        groups
    };
}
function getRouteRegex(normalizedRoute) {
    const { parameterizedRoute , groups  } = getParametrizedRoute(normalizedRoute);
    return {
        re: new RegExp("^" + parameterizedRoute + "(?:/)?$"),
        groups: groups
    };
}
/**
 * Builds a function to generate a minimal routeKey using only a-z and minimal
 * number of characters.
 */ function buildGetSafeRouteKey() {
    let routeKeyCharCode = 97;
    let routeKeyCharLength = 1;
    return ()=>{
        let routeKey = "";
        for(let i = 0; i < routeKeyCharLength; i++){
            routeKey += String.fromCharCode(routeKeyCharCode);
            routeKeyCharCode++;
            if (routeKeyCharCode > 122) {
                routeKeyCharLength++;
                routeKeyCharCode = 97;
            }
        }
        return routeKey;
    };
}
function getNamedParametrizedRoute(route, prefixRouteKeys) {
    const segments = (0, _removetrailingslash.removeTrailingSlash)(route).slice(1).split("/");
    const getSafeRouteKey = buildGetSafeRouteKey();
    const routeKeys = {};
    return {
        namedParameterizedRoute: segments.map((segment)=>{
            if (segment.startsWith("[") && segment.endsWith("]")) {
                const { key , optional , repeat  } = parseParameter(segment.slice(1, -1));
                // replace any non-word characters since they can break
                // the named regex
                let cleanedKey = key.replace(/\W/g, "");
                if (prefixRouteKeys) {
                    cleanedKey = "" + NEXT_QUERY_PARAM_PREFIX + cleanedKey;
                }
                let invalidKey = false;
                // check if the key is still invalid and fallback to using a known
                // safe key
                if (cleanedKey.length === 0 || cleanedKey.length > 30) {
                    invalidKey = true;
                }
                if (!isNaN(parseInt(cleanedKey.slice(0, 1)))) {
                    invalidKey = true;
                }
                if (invalidKey) {
                    cleanedKey = getSafeRouteKey();
                }
                if (prefixRouteKeys) {
                    routeKeys[cleanedKey] = "" + NEXT_QUERY_PARAM_PREFIX + key;
                } else {
                    routeKeys[cleanedKey] = "" + key;
                }
                return repeat ? optional ? "(?:/(?<" + cleanedKey + ">.+?))?" : "/(?<" + cleanedKey + ">.+?)" : "/(?<" + cleanedKey + ">[^/]+?)";
            } else {
                return "/" + (0, _escaperegexp.escapeStringRegexp)(segment);
            }
        }).join(""),
        routeKeys
    };
}
function getNamedRouteRegex(normalizedRoute, prefixRouteKey) {
    const result = getNamedParametrizedRoute(normalizedRoute, prefixRouteKey);
    return {
        ...getRouteRegex(normalizedRoute),
        namedRegex: "^" + result.namedParameterizedRoute + "(?:/)?$",
        routeKeys: result.routeKeys
    };
}
function getNamedMiddlewareRegex(normalizedRoute, options) {
    const { parameterizedRoute  } = getParametrizedRoute(normalizedRoute);
    const { catchAll =true  } = options;
    if (parameterizedRoute === "/") {
        let catchAllRegex = catchAll ? ".*" : "";
        return {
            namedRegex: "^/" + catchAllRegex + "$"
        };
    }
    const { namedParameterizedRoute  } = getNamedParametrizedRoute(normalizedRoute, false);
    let catchAllGroupedRegex = catchAll ? "(?:(/.*)?)" : "";
    return {
        namedRegex: "^" + namedParameterizedRoute + catchAllGroupedRegex + "$"
    };
} //# sourceMappingURL=route-regex.js.map


/***/ }),

/***/ 93762:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getSortedRoutes", ({
    enumerable: true,
    get: function() {
        return getSortedRoutes;
    }
}));
class UrlNode {
    insert(urlPath) {
        this._insert(urlPath.split("/").filter(Boolean), [], false);
    }
    smoosh() {
        return this._smoosh();
    }
    _smoosh(prefix) {
        if (prefix === void 0) prefix = "/";
        const childrenPaths = [
            ...this.children.keys()
        ].sort();
        if (this.slugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf("[]"), 1);
        }
        if (this.restSlugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf("[...]"), 1);
        }
        if (this.optionalRestSlugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf("[[...]]"), 1);
        }
        const routes = childrenPaths.map((c)=>this.children.get(c)._smoosh("" + prefix + c + "/")).reduce((prev, curr)=>[
                ...prev,
                ...curr
            ], []);
        if (this.slugName !== null) {
            routes.push(...this.children.get("[]")._smoosh(prefix + "[" + this.slugName + "]/"));
        }
        if (!this.placeholder) {
            const r = prefix === "/" ? "/" : prefix.slice(0, -1);
            if (this.optionalRestSlugName != null) {
                throw new Error('You cannot define a route with the same specificity as a optional catch-all route ("' + r + '" and "' + r + "[[..." + this.optionalRestSlugName + ']]").');
            }
            routes.unshift(r);
        }
        if (this.restSlugName !== null) {
            routes.push(...this.children.get("[...]")._smoosh(prefix + "[..." + this.restSlugName + "]/"));
        }
        if (this.optionalRestSlugName !== null) {
            routes.push(...this.children.get("[[...]]")._smoosh(prefix + "[[..." + this.optionalRestSlugName + "]]/"));
        }
        return routes;
    }
    _insert(urlPaths, slugNames, isCatchAll) {
        if (urlPaths.length === 0) {
            this.placeholder = false;
            return;
        }
        if (isCatchAll) {
            throw new Error("Catch-all must be the last part of the URL.");
        }
        // The next segment in the urlPaths list
        let nextSegment = urlPaths[0];
        // Check if the segment matches `[something]`
        if (nextSegment.startsWith("[") && nextSegment.endsWith("]")) {
            // Strip `[` and `]`, leaving only `something`
            let segmentName = nextSegment.slice(1, -1);
            let isOptional = false;
            if (segmentName.startsWith("[") && segmentName.endsWith("]")) {
                // Strip optional `[` and `]`, leaving only `something`
                segmentName = segmentName.slice(1, -1);
                isOptional = true;
            }
            if (segmentName.startsWith("...")) {
                // Strip `...`, leaving only `something`
                segmentName = segmentName.substring(3);
                isCatchAll = true;
            }
            if (segmentName.startsWith("[") || segmentName.endsWith("]")) {
                throw new Error("Segment names may not start or end with extra brackets ('" + segmentName + "').");
            }
            if (segmentName.startsWith(".")) {
                throw new Error("Segment names may not start with erroneous periods ('" + segmentName + "').");
            }
            function handleSlug(previousSlug, nextSlug) {
                if (previousSlug !== null) {
                    // If the specific segment already has a slug but the slug is not `something`
                    // This prevents collisions like:
                    // pages/[post]/index.js
                    // pages/[id]/index.js
                    // Because currently multiple dynamic params on the same segment level are not supported
                    if (previousSlug !== nextSlug) {
                        // TODO: This error seems to be confusing for users, needs an error link, the description can be based on above comment.
                        throw new Error("You cannot use different slug names for the same dynamic path ('" + previousSlug + "' !== '" + nextSlug + "').");
                    }
                }
                slugNames.forEach((slug)=>{
                    if (slug === nextSlug) {
                        throw new Error('You cannot have the same slug name "' + nextSlug + '" repeat within a single dynamic path');
                    }
                    if (slug.replace(/\W/g, "") === nextSegment.replace(/\W/g, "")) {
                        throw new Error('You cannot have the slug names "' + slug + '" and "' + nextSlug + '" differ only by non-word symbols within a single dynamic path');
                    }
                });
                slugNames.push(nextSlug);
            }
            if (isCatchAll) {
                if (isOptional) {
                    if (this.restSlugName != null) {
                        throw new Error('You cannot use both an required and optional catch-all route at the same level ("[...' + this.restSlugName + ']" and "' + urlPaths[0] + '" ).');
                    }
                    handleSlug(this.optionalRestSlugName, segmentName);
                    // slugName is kept as it can only be one particular slugName
                    this.optionalRestSlugName = segmentName;
                    // nextSegment is overwritten to [[...]] so that it can later be sorted specifically
                    nextSegment = "[[...]]";
                } else {
                    if (this.optionalRestSlugName != null) {
                        throw new Error('You cannot use both an optional and required catch-all route at the same level ("[[...' + this.optionalRestSlugName + ']]" and "' + urlPaths[0] + '").');
                    }
                    handleSlug(this.restSlugName, segmentName);
                    // slugName is kept as it can only be one particular slugName
                    this.restSlugName = segmentName;
                    // nextSegment is overwritten to [...] so that it can later be sorted specifically
                    nextSegment = "[...]";
                }
            } else {
                if (isOptional) {
                    throw new Error('Optional route parameters are not yet supported ("' + urlPaths[0] + '").');
                }
                handleSlug(this.slugName, segmentName);
                // slugName is kept as it can only be one particular slugName
                this.slugName = segmentName;
                // nextSegment is overwritten to [] so that it can later be sorted specifically
                nextSegment = "[]";
            }
        }
        // If this UrlNode doesn't have the nextSegment yet we create a new child UrlNode
        if (!this.children.has(nextSegment)) {
            this.children.set(nextSegment, new UrlNode());
        }
        this.children.get(nextSegment)._insert(urlPaths.slice(1), slugNames, isCatchAll);
    }
    constructor(){
        this.placeholder = true;
        this.children = new Map();
        this.slugName = null;
        this.restSlugName = null;
        this.optionalRestSlugName = null;
    }
}
function getSortedRoutes(normalizedPages) {
    // First the UrlNode is created, and every UrlNode can have only 1 dynamic segment
    // Eg you can't have pages/[post]/abc.js and pages/[hello]/something-else.js
    // Only 1 dynamic segment per nesting level
    // So in the case that is test/integration/dynamic-routing it'll be this:
    // pages/[post]/comments.js
    // pages/blog/[post]/comment/[id].js
    // Both are fine because `pages/[post]` and `pages/blog` are on the same level
    // So in this case `UrlNode` created here has `this.slugName === 'post'`
    // And since your PR passed through `slugName` as an array basically it'd including it in too many possibilities
    // Instead what has to be passed through is the upwards path's dynamic names
    const root = new UrlNode();
    // Here the `root` gets injected multiple paths, and insert will break them up into sublevels
    normalizedPages.forEach((pagePath)=>root.insert(pagePath));
    // Smoosh will then sort those sublevels up to the point where you get the correct route definition priority
    return root.smoosh();
} //# sourceMappingURL=sorted-routes.js.map


/***/ }),

/***/ 75830:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(95284);

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ 69232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) { var throwOnDirectAccess, ReactIs; } else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(75830)();
}


/***/ }),

/***/ 95284:
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ 95967:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports._ = exports._interop_require_default = _interop_require_default;
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}


/***/ }),

/***/ 41113:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;

    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();

    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
exports._ = exports._interop_require_wildcard = _interop_require_wildcard;
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) return obj;
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") return { default: obj };

    var cache = _getRequireWildcardCache(nodeInterop);

    if (cache && cache.has(obj)) return cache.get(obj);

    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

    for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
            else newObj[key] = obj[key];
        }
    }

    newObj.default = obj;

    if (cache) cache.set(obj, newObj);

    return newObj;
}


/***/ }),

/***/ 29140:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports._ = exports._interop_require_default = _interop_require_default;
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}


/***/ }),

/***/ 14958:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Mj": () => (/* binding */ composeEventHandlers)
/* harmony export */ });
/* unused harmony exports canUseDOM, getActiveElement, getOwnerDocument, getOwnerWindow, isFrame */
// src/primitive.tsx
var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return function handleEvent(event) {
    originalEventHandler?.(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}
function getOwnerWindow(element) {
  if (!canUseDOM) {
    throw new Error("Cannot access window outside of the DOM");
  }
  return element?.ownerDocument?.defaultView ?? window;
}
function getOwnerDocument(element) {
  if (!canUseDOM) {
    throw new Error("Cannot access document outside of the DOM");
  }
  return element?.ownerDocument ?? document;
}
function getActiveElement(node, activeDescendant = false) {
  const { activeElement } = getOwnerDocument(node);
  if (!activeElement?.nodeName) {
    return null;
  }
  if (isFrame(activeElement) && activeElement.contentDocument) {
    return getActiveElement(activeElement.contentDocument.body, activeDescendant);
  }
  if (activeDescendant) {
    const id = activeElement.getAttribute("aria-activedescendant");
    if (id) {
      const element = getOwnerDocument(activeElement).getElementById(id);
      if (element) {
        return element;
      }
    }
  }
  return activeElement;
}
function isFrame(element) {
  return element.tagName === "IFRAME";
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 25580:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "B": () => (/* binding */ createCollection)
/* harmony export */ });
/* unused harmony export unstable_createCollection */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
/* harmony import */ var _radix_ui_react_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(95866);
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(49837);
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(59818);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(56786);
"use client";

// src/collection-legacy.tsx





function createCollection(name) {
  const PROVIDER_NAME = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope] = (0,_radix_ui_react_context__WEBPACK_IMPORTED_MODULE_2__/* .createContextScope */ .b)(PROVIDER_NAME);
  const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(
    PROVIDER_NAME,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  );
  const CollectionProvider = (props) => {
    const { scope, children } = props;
    const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
    const itemMap = react__WEBPACK_IMPORTED_MODULE_0__.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(CollectionProviderImpl, { scope, itemMap, collectionRef: ref, children });
  };
  CollectionProvider.displayName = PROVIDER_NAME;
  const COLLECTION_SLOT_NAME = name + "CollectionSlot";
  const CollectionSlotImpl = (0,_radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__/* .createSlot */ .Z8)(COLLECTION_SLOT_NAME);
  const CollectionSlot = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
    (props, forwardedRef) => {
      const { scope, children } = props;
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_4__/* .useComposedRefs */ .e)(forwardedRef, context.collectionRef);
      return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(CollectionSlotImpl, { ref: composedRefs, children });
    }
  );
  CollectionSlot.displayName = COLLECTION_SLOT_NAME;
  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";
  const CollectionItemSlotImpl = (0,_radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__/* .createSlot */ .Z8)(ITEM_SLOT_NAME);
  const CollectionItemSlot = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(
    (props, forwardedRef) => {
      const { scope, children, ...itemData } = props;
      const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
      const composedRefs = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_4__/* .useComposedRefs */ .e)(forwardedRef, ref);
      const context = useCollectionContext(ITEM_SLOT_NAME, scope);
      react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
        context.itemMap.set(ref, { ref, ...itemData });
        return () => void context.itemMap.delete(ref);
      });
      return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(CollectionItemSlotImpl, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
    }
  );
  CollectionItemSlot.displayName = ITEM_SLOT_NAME;
  function useCollection(scope) {
    const context = useCollectionContext(name + "CollectionConsumer", scope);
    const getItems = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current)
      );
      return orderedItems;
    }, [context.collectionRef, context.itemMap]);
    return getItems;
  }
  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    useCollection,
    createCollectionScope
  ];
}

// src/collection.tsx





// src/ordered-dictionary.ts
var __instanciated = /* @__PURE__ */ new WeakMap();
var OrderedDict = class _OrderedDict extends Map {
  #keys;
  constructor(entries) {
    super(entries);
    this.#keys = [...super.keys()];
    __instanciated.set(this, true);
  }
  set(key, value) {
    if (__instanciated.get(this)) {
      if (this.has(key)) {
        this.#keys[this.#keys.indexOf(key)] = key;
      } else {
        this.#keys.push(key);
      }
    }
    super.set(key, value);
    return this;
  }
  insert(index, key, value) {
    const has = this.has(key);
    const length = this.#keys.length;
    const relativeIndex = toSafeInteger(index);
    let actualIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;
    const safeIndex = actualIndex < 0 || actualIndex >= length ? -1 : actualIndex;
    if (safeIndex === this.size || has && safeIndex === this.size - 1 || safeIndex === -1) {
      this.set(key, value);
      return this;
    }
    const size = this.size + (has ? 0 : 1);
    if (relativeIndex < 0) {
      actualIndex++;
    }
    const keys = [...this.#keys];
    let nextValue;
    let shouldSkip = false;
    for (let i = actualIndex; i < size; i++) {
      if (actualIndex === i) {
        let nextKey = keys[i];
        if (keys[i] === key) {
          nextKey = keys[i + 1];
        }
        if (has) {
          this.delete(key);
        }
        nextValue = this.get(nextKey);
        this.set(key, value);
      } else {
        if (!shouldSkip && keys[i - 1] === key) {
          shouldSkip = true;
        }
        const currentKey = keys[shouldSkip ? i : i - 1];
        const currentValue = nextValue;
        nextValue = this.get(currentKey);
        this.delete(currentKey);
        this.set(currentKey, currentValue);
      }
    }
    return this;
  }
  with(index, key, value) {
    const copy = new _OrderedDict(this);
    copy.insert(index, key, value);
    return copy;
  }
  before(key) {
    const index = this.#keys.indexOf(key) - 1;
    if (index < 0) {
      return void 0;
    }
    return this.entryAt(index);
  }
  /**
   * Sets a new key-value pair at the position before the given key.
   */
  setBefore(key, newKey, value) {
    const index = this.#keys.indexOf(key);
    if (index === -1) {
      return this;
    }
    return this.insert(index, newKey, value);
  }
  after(key) {
    let index = this.#keys.indexOf(key);
    index = index === -1 || index === this.size - 1 ? -1 : index + 1;
    if (index === -1) {
      return void 0;
    }
    return this.entryAt(index);
  }
  /**
   * Sets a new key-value pair at the position after the given key.
   */
  setAfter(key, newKey, value) {
    const index = this.#keys.indexOf(key);
    if (index === -1) {
      return this;
    }
    return this.insert(index + 1, newKey, value);
  }
  first() {
    return this.entryAt(0);
  }
  last() {
    return this.entryAt(-1);
  }
  clear() {
    this.#keys = [];
    return super.clear();
  }
  delete(key) {
    const deleted = super.delete(key);
    if (deleted) {
      this.#keys.splice(this.#keys.indexOf(key), 1);
    }
    return deleted;
  }
  deleteAt(index) {
    const key = this.keyAt(index);
    if (key !== void 0) {
      return this.delete(key);
    }
    return false;
  }
  at(index) {
    const key = at(this.#keys, index);
    if (key !== void 0) {
      return this.get(key);
    }
  }
  entryAt(index) {
    const key = at(this.#keys, index);
    if (key !== void 0) {
      return [key, this.get(key)];
    }
  }
  indexOf(key) {
    return this.#keys.indexOf(key);
  }
  keyAt(index) {
    return at(this.#keys, index);
  }
  from(key, offset) {
    const index = this.indexOf(key);
    if (index === -1) {
      return void 0;
    }
    let dest = index + offset;
    if (dest < 0) dest = 0;
    if (dest >= this.size) dest = this.size - 1;
    return this.at(dest);
  }
  keyFrom(key, offset) {
    const index = this.indexOf(key);
    if (index === -1) {
      return void 0;
    }
    let dest = index + offset;
    if (dest < 0) dest = 0;
    if (dest >= this.size) dest = this.size - 1;
    return this.keyAt(dest);
  }
  find(predicate, thisArg) {
    let index = 0;
    for (const entry of this) {
      if (Reflect.apply(predicate, thisArg, [entry, index, this])) {
        return entry;
      }
      index++;
    }
    return void 0;
  }
  findIndex(predicate, thisArg) {
    let index = 0;
    for (const entry of this) {
      if (Reflect.apply(predicate, thisArg, [entry, index, this])) {
        return index;
      }
      index++;
    }
    return -1;
  }
  filter(predicate, thisArg) {
    const entries = [];
    let index = 0;
    for (const entry of this) {
      if (Reflect.apply(predicate, thisArg, [entry, index, this])) {
        entries.push(entry);
      }
      index++;
    }
    return new _OrderedDict(entries);
  }
  map(callbackfn, thisArg) {
    const entries = [];
    let index = 0;
    for (const entry of this) {
      entries.push([entry[0], Reflect.apply(callbackfn, thisArg, [entry, index, this])]);
      index++;
    }
    return new _OrderedDict(entries);
  }
  reduce(...args) {
    const [callbackfn, initialValue] = args;
    let index = 0;
    let accumulator = initialValue ?? this.at(0);
    for (const entry of this) {
      if (index === 0 && args.length === 1) {
        accumulator = entry;
      } else {
        accumulator = Reflect.apply(callbackfn, this, [accumulator, entry, index, this]);
      }
      index++;
    }
    return accumulator;
  }
  reduceRight(...args) {
    const [callbackfn, initialValue] = args;
    let accumulator = initialValue ?? this.at(-1);
    for (let index = this.size - 1; index >= 0; index--) {
      const entry = this.at(index);
      if (index === this.size - 1 && args.length === 1) {
        accumulator = entry;
      } else {
        accumulator = Reflect.apply(callbackfn, this, [accumulator, entry, index, this]);
      }
    }
    return accumulator;
  }
  toSorted(compareFn) {
    const entries = [...this.entries()].sort(compareFn);
    return new _OrderedDict(entries);
  }
  toReversed() {
    const reversed = new _OrderedDict();
    for (let index = this.size - 1; index >= 0; index--) {
      const key = this.keyAt(index);
      const element = this.get(key);
      reversed.set(key, element);
    }
    return reversed;
  }
  toSpliced(...args) {
    const entries = [...this.entries()];
    entries.splice(...args);
    return new _OrderedDict(entries);
  }
  slice(start, end) {
    const result = new _OrderedDict();
    let stop = this.size - 1;
    if (start === void 0) {
      return result;
    }
    if (start < 0) {
      start = start + this.size;
    }
    if (end !== void 0 && end > 0) {
      stop = end - 1;
    }
    for (let index = start; index <= stop; index++) {
      const key = this.keyAt(index);
      const element = this.get(key);
      result.set(key, element);
    }
    return result;
  }
  every(predicate, thisArg) {
    let index = 0;
    for (const entry of this) {
      if (!Reflect.apply(predicate, thisArg, [entry, index, this])) {
        return false;
      }
      index++;
    }
    return true;
  }
  some(predicate, thisArg) {
    let index = 0;
    for (const entry of this) {
      if (Reflect.apply(predicate, thisArg, [entry, index, this])) {
        return true;
      }
      index++;
    }
    return false;
  }
};
function at(array, index) {
  if ("at" in Array.prototype) {
    return Array.prototype.at.call(array, index);
  }
  const actualIndex = toSafeIndex(array, index);
  return actualIndex === -1 ? void 0 : array[actualIndex];
}
function toSafeIndex(array, index) {
  const length = array.length;
  const relativeIndex = toSafeInteger(index);
  const actualIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;
  return actualIndex < 0 || actualIndex >= length ? -1 : actualIndex;
}
function toSafeInteger(number) {
  return number !== number || number === 0 ? 0 : Math.trunc(number);
}

// src/collection.tsx

function createCollection2(name) {
  const PROVIDER_NAME = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope] = createContextScope2(PROVIDER_NAME);
  const [CollectionContextProvider, useCollectionContext] = createCollectionContext(
    PROVIDER_NAME,
    {
      collectionElement: null,
      collectionRef: { current: null },
      collectionRefObject: { current: null },
      itemMap: new OrderedDict(),
      setItemMap: () => void 0
    }
  );
  const CollectionProvider = ({ state, ...props }) => {
    return state ? /* @__PURE__ */ jsx2(CollectionProviderImpl, { ...props, state }) : /* @__PURE__ */ jsx2(CollectionInit, { ...props });
  };
  CollectionProvider.displayName = PROVIDER_NAME;
  const CollectionInit = (props) => {
    const state = useInitCollection();
    return /* @__PURE__ */ jsx2(CollectionProviderImpl, { ...props, state });
  };
  CollectionInit.displayName = PROVIDER_NAME + "Init";
  const CollectionProviderImpl = (props) => {
    const { scope, children, state } = props;
    const ref = React2.useRef(null);
    const [collectionElement, setCollectionElement] = React2.useState(
      null
    );
    const composeRefs = useComposedRefs2(ref, setCollectionElement);
    const [itemMap, setItemMap] = state;
    React2.useEffect(() => {
      if (!collectionElement) return;
      const observer = getChildListObserver(() => {
      });
      observer.observe(collectionElement, {
        childList: true,
        subtree: true
      });
      return () => {
        observer.disconnect();
      };
    }, [collectionElement]);
    return /* @__PURE__ */ jsx2(
      CollectionContextProvider,
      {
        scope,
        itemMap,
        setItemMap,
        collectionRef: composeRefs,
        collectionRefObject: ref,
        collectionElement,
        children
      }
    );
  };
  CollectionProviderImpl.displayName = PROVIDER_NAME + "Impl";
  const COLLECTION_SLOT_NAME = name + "CollectionSlot";
  const CollectionSlotImpl = createSlot2(COLLECTION_SLOT_NAME);
  const CollectionSlot = React2.forwardRef(
    (props, forwardedRef) => {
      const { scope, children } = props;
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = useComposedRefs2(forwardedRef, context.collectionRef);
      return /* @__PURE__ */ jsx2(CollectionSlotImpl, { ref: composedRefs, children });
    }
  );
  CollectionSlot.displayName = COLLECTION_SLOT_NAME;
  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";
  const CollectionItemSlotImpl = createSlot2(ITEM_SLOT_NAME);
  const CollectionItemSlot = React2.forwardRef(
    (props, forwardedRef) => {
      const { scope, children, ...itemData } = props;
      const ref = React2.useRef(null);
      const [element, setElement] = React2.useState(null);
      const composedRefs = useComposedRefs2(forwardedRef, ref, setElement);
      const context = useCollectionContext(ITEM_SLOT_NAME, scope);
      const { setItemMap } = context;
      const itemDataRef = React2.useRef(itemData);
      if (!shallowEqual(itemDataRef.current, itemData)) {
        itemDataRef.current = itemData;
      }
      const memoizedItemData = itemDataRef.current;
      React2.useEffect(() => {
        const itemData2 = memoizedItemData;
        setItemMap((map) => {
          if (!element) {
            return map;
          }
          if (!map.has(element)) {
            map.set(element, { ...itemData2, element });
            return map.toSorted(sortByDocumentPosition);
          }
          return map.set(element, { ...itemData2, element }).toSorted(sortByDocumentPosition);
        });
        return () => {
          setItemMap((map) => {
            if (!element || !map.has(element)) {
              return map;
            }
            map.delete(element);
            return new OrderedDict(map);
          });
        };
      }, [element, memoizedItemData, setItemMap]);
      return /* @__PURE__ */ jsx2(CollectionItemSlotImpl, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
    }
  );
  CollectionItemSlot.displayName = ITEM_SLOT_NAME;
  function useInitCollection() {
    return React2.useState(new OrderedDict());
  }
  function useCollection(scope) {
    const { itemMap } = useCollectionContext(name + "CollectionConsumer", scope);
    return itemMap;
  }
  const functions = {
    createCollectionScope,
    useCollection,
    useInitCollection
  };
  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    functions
  ];
}
function shallowEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object") return false;
  if (a == null || b == null) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (a[key] !== b[key]) return false;
  }
  return true;
}
function isElementPreceding(a, b) {
  return !!(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING);
}
function sortByDocumentPosition(a, b) {
  return !a[1].element || !b[1].element ? 0 : isElementPreceding(a[1].element, b[1].element) ? -1 : 1;
}
function getChildListObserver(callback) {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        callback();
        return;
      }
    }
  });
  return observer;
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 49837:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "F": () => (/* binding */ composeRefs),
/* harmony export */   "e": () => (/* binding */ useComposedRefs)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
// packages/react/compose-refs/src/compose-refs.tsx

function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return react__WEBPACK_IMPORTED_MODULE_0__.useCallback(composeRefs(...refs), refs);
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 95866:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "b": () => (/* binding */ createContextScope),
/* harmony export */   "k": () => (/* binding */ createContext2)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(56786);
// packages/react/context/src/create-context.tsx


function createContext2(rootComponentName, defaultContext) {
  const Context = react__WEBPACK_IMPORTED_MODULE_0__.createContext(defaultContext);
  const Provider = (props) => {
    const { children, ...context } = props;
    const value = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => context, Object.values(context));
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Context.Provider, { value, children });
  };
  Provider.displayName = rootComponentName + "Provider";
  function useContext2(consumerName) {
    const context = react__WEBPACK_IMPORTED_MODULE_0__.useContext(Context);
    if (context) return context;
    if (defaultContext !== void 0) return defaultContext;
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
  }
  return [Provider, useContext2];
}
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(defaultContext);
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      const { scope, children, ...context } = props;
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const value = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const context = react__WEBPACK_IMPORTED_MODULE_0__.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return react__WEBPACK_IMPORTED_MODULE_0__.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = scope?.[scopeName] || scopeContexts;
      return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 85009:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "I0": () => (/* binding */ Branch),
  "XB": () => (/* binding */ DismissableLayer),
  "fC": () => (/* binding */ Root)
});

// UNUSED EXPORTS: DismissableLayerBranch

// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/@radix-ui/primitive/dist/index.mjs
var dist = __webpack_require__(14958);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-primitive/dist/index.mjs
var react_primitive_dist = __webpack_require__(15585);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-compose-refs/dist/index.mjs
var react_compose_refs_dist = __webpack_require__(49837);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
var react_use_callback_ref_dist = __webpack_require__(76601);
;// CONCATENATED MODULE: ./node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs
// packages/react/use-escape-keydown/src/use-escape-keydown.tsx


function useEscapeKeydown(onEscapeKeyDownProp, ownerDocument = globalThis?.document) {
  const onEscapeKeyDown = (0,react_use_callback_ref_dist/* useCallbackRef */.W)(onEscapeKeyDownProp);
  react_.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onEscapeKeyDown(event);
      }
    };
    ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [onEscapeKeyDown, ownerDocument]);
}

//# sourceMappingURL=index.mjs.map

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
;// CONCATENATED MODULE: ./node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
"use client";

// src/dismissable-layer.tsx







var DISMISSABLE_LAYER_NAME = "DismissableLayer";
var CONTEXT_UPDATE = "dismissableLayer.update";
var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
var originalBodyPointerEvents;
var DismissableLayerContext = react_.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
});
var DismissableLayer = react_.forwardRef(
  (props, forwardedRef) => {
    const {
      disableOutsidePointerEvents = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      ...layerProps
    } = props;
    const context = react_.useContext(DismissableLayerContext);
    const [node, setNode] = react_.useState(null);
    const ownerDocument = node?.ownerDocument ?? globalThis?.document;
    const [, force] = react_.useState({});
    const composedRefs = (0,react_compose_refs_dist/* useComposedRefs */.e)(forwardedRef, (node2) => setNode(node2));
    const layers = Array.from(context.layers);
    const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
    const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
    const index = node ? layers.indexOf(node) : -1;
    const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
    const isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex;
    const pointerDownOutside = usePointerDownOutside((event) => {
      const target = event.target;
      const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
      if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
      onPointerDownOutside?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) onDismiss?.();
    }, ownerDocument);
    const focusOutside = useFocusOutside((event) => {
      const target = event.target;
      const isFocusInBranch = [...context.branches].some((branch) => branch.contains(target));
      if (isFocusInBranch) return;
      onFocusOutside?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) onDismiss?.();
    }, ownerDocument);
    useEscapeKeydown((event) => {
      const isHighestLayer = index === context.layers.size - 1;
      if (!isHighestLayer) return;
      onEscapeKeyDown?.(event);
      if (!event.defaultPrevented && onDismiss) {
        event.preventDefault();
        onDismiss();
      }
    }, ownerDocument);
    react_.useEffect(() => {
      if (!node) return;
      if (disableOutsidePointerEvents) {
        if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
          originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
          ownerDocument.body.style.pointerEvents = "none";
        }
        context.layersWithOutsidePointerEventsDisabled.add(node);
      }
      context.layers.add(node);
      dispatchUpdate();
      return () => {
        if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) {
          ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
        }
      };
    }, [node, ownerDocument, disableOutsidePointerEvents, context]);
    react_.useEffect(() => {
      return () => {
        if (!node) return;
        context.layers.delete(node);
        context.layersWithOutsidePointerEventsDisabled.delete(node);
        dispatchUpdate();
      };
    }, [node, context]);
    react_.useEffect(() => {
      const handleUpdate = () => force({});
      document.addEventListener(CONTEXT_UPDATE, handleUpdate);
      return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
    }, []);
    return /* @__PURE__ */ (0,jsx_runtime_.jsx)(
      react_primitive_dist/* Primitive.div */.WV.div,
      {
        ...layerProps,
        ref: composedRefs,
        style: {
          pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
          ...props.style
        },
        onFocusCapture: (0,dist/* composeEventHandlers */.Mj)(props.onFocusCapture, focusOutside.onFocusCapture),
        onBlurCapture: (0,dist/* composeEventHandlers */.Mj)(props.onBlurCapture, focusOutside.onBlurCapture),
        onPointerDownCapture: (0,dist/* composeEventHandlers */.Mj)(
          props.onPointerDownCapture,
          pointerDownOutside.onPointerDownCapture
        )
      }
    );
  }
);
DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
var BRANCH_NAME = "DismissableLayerBranch";
var DismissableLayerBranch = react_.forwardRef((props, forwardedRef) => {
  const context = react_.useContext(DismissableLayerContext);
  const ref = react_.useRef(null);
  const composedRefs = (0,react_compose_refs_dist/* useComposedRefs */.e)(forwardedRef, ref);
  react_.useEffect(() => {
    const node = ref.current;
    if (node) {
      context.branches.add(node);
      return () => {
        context.branches.delete(node);
      };
    }
  }, [context.branches]);
  return /* @__PURE__ */ (0,jsx_runtime_.jsx)(react_primitive_dist/* Primitive.div */.WV.div, { ...props, ref: composedRefs });
});
DismissableLayerBranch.displayName = BRANCH_NAME;
function usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis?.document) {
  const handlePointerDownOutside = (0,react_use_callback_ref_dist/* useCallbackRef */.W)(onPointerDownOutside);
  const isPointerInsideReactTreeRef = react_.useRef(false);
  const handleClickRef = react_.useRef(() => {
  });
  react_.useEffect(() => {
    const handlePointerDown = (event) => {
      if (event.target && !isPointerInsideReactTreeRef.current) {
        let handleAndDispatchPointerDownOutsideEvent2 = function() {
          handleAndDispatchCustomEvent(
            POINTER_DOWN_OUTSIDE,
            handlePointerDownOutside,
            eventDetail,
            { discrete: true }
          );
        };
        var handleAndDispatchPointerDownOutsideEvent = handleAndDispatchPointerDownOutsideEvent2;
        const eventDetail = { originalEvent: event };
        if (event.pointerType === "touch") {
          ownerDocument.removeEventListener("click", handleClickRef.current);
          handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
          ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
        } else {
          handleAndDispatchPointerDownOutsideEvent2();
        }
      } else {
        ownerDocument.removeEventListener("click", handleClickRef.current);
      }
      isPointerInsideReactTreeRef.current = false;
    };
    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener("pointerdown", handlePointerDown);
    }, 0);
    return () => {
      window.clearTimeout(timerId);
      ownerDocument.removeEventListener("pointerdown", handlePointerDown);
      ownerDocument.removeEventListener("click", handleClickRef.current);
    };
  }, [ownerDocument, handlePointerDownOutside]);
  return {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true
  };
}
function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
  const handleFocusOutside = (0,react_use_callback_ref_dist/* useCallbackRef */.W)(onFocusOutside);
  const isFocusInsideReactTreeRef = react_.useRef(false);
  react_.useEffect(() => {
    const handleFocus = (event) => {
      if (event.target && !isFocusInsideReactTreeRef.current) {
        const eventDetail = { originalEvent: event };
        handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
          discrete: false
        });
      }
    };
    ownerDocument.addEventListener("focusin", handleFocus);
    return () => ownerDocument.removeEventListener("focusin", handleFocus);
  }, [ownerDocument, handleFocusOutside]);
  return {
    onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
    onBlurCapture: () => isFocusInsideReactTreeRef.current = false
  };
}
function dispatchUpdate() {
  const event = new CustomEvent(CONTEXT_UPDATE);
  document.dispatchEvent(event);
}
function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
  const target = detail.originalEvent.target;
  const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail });
  if (handler) target.addEventListener(name, handler, { once: true });
  if (discrete) {
    (0,react_primitive_dist/* dispatchDiscreteCustomEvent */.jH)(target, event);
  } else {
    target.dispatchEvent(event);
  }
}
var Root = DismissableLayer;
var Branch = DismissableLayerBranch;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 23214:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "h": () => (/* binding */ Portal)
/* harmony export */ });
/* unused harmony export Root */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98704);
/* harmony import */ var _radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(15585);
/* harmony import */ var _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(72660);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(56786);
"use client";

// src/portal.tsx





var PORTAL_NAME = "Portal";
var Portal = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
  const { container: containerProp, ...portalProps } = props;
  const [mounted, setMounted] = react__WEBPACK_IMPORTED_MODULE_0__.useState(false);
  (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_3__/* .useLayoutEffect */ .b)(() => setMounted(true), []);
  const container = containerProp || mounted && globalThis?.document?.body;
  return container ? react_dom__WEBPACK_IMPORTED_MODULE_1__.createPortal(/* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_radix_ui_react_primitive__WEBPACK_IMPORTED_MODULE_4__/* .Primitive.div */ .WV.div, { ...portalProps, ref: forwardedRef }), container) : null;
});
Portal.displayName = PORTAL_NAME;
var Root = (/* unused pure expression or super */ null && (Portal));

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 84261:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "z": () => (/* binding */ Presence)
/* harmony export */ });
/* unused harmony export Root */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(49837);
/* harmony import */ var _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(72660);
"use client";

// src/presence.tsx




// src/use-state-machine.tsx

function useStateMachine(initialState, machine) {
  return react__WEBPACK_IMPORTED_MODULE_0__.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}

// src/presence.tsx
var Presence = (props) => {
  const { present, children } = props;
  const presence = usePresence(present);
  const child = typeof children === "function" ? children({ present: presence.isPresent }) : react__WEBPACK_IMPORTED_MODULE_0__.Children.only(children);
  const ref = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_1__/* .useComposedRefs */ .e)(presence.ref, getElementRef(child));
  const forceMount = typeof children === "function";
  return forceMount || presence.isPresent ? react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(child, { ref }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
  const [node, setNode] = react__WEBPACK_IMPORTED_MODULE_0__.useState();
  const stylesRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(null);
  const prevPresentRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(present);
  const prevAnimationNameRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef("none");
  const initialState = present ? "mounted" : "unmounted";
  const [state, send] = useStateMachine(initialState, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current);
    prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
  }, [state]);
  (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_2__/* .useLayoutEffect */ .b)(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;
    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);
      if (present) {
        send("MOUNT");
      } else if (currentAnimationName === "none" || styles?.display === "none") {
        send("UNMOUNT");
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        if (wasPresent && isAnimating) {
          send("ANIMATION_OUT");
        } else {
          send("UNMOUNT");
        }
      }
      prevPresentRef.current = present;
    }
  }, [present, send]);
  (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_2__/* .useLayoutEffect */ .b)(() => {
    if (node) {
      let timeoutId;
      const ownerWindow = node.ownerDocument.defaultView ?? window;
      const handleAnimationEnd = (event) => {
        const currentAnimationName = getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
        if (event.target === node && isCurrentAnimation) {
          send("ANIMATION_END");
          if (!prevPresentRef.current) {
            const currentFillMode = node.style.animationFillMode;
            node.style.animationFillMode = "forwards";
            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === "forwards") {
                node.style.animationFillMode = currentFillMode;
              }
            });
          }
        }
      };
      const handleAnimationStart = (event) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current);
        }
      };
      node.addEventListener("animationstart", handleAnimationStart);
      node.addEventListener("animationcancel", handleAnimationEnd);
      node.addEventListener("animationend", handleAnimationEnd);
      return () => {
        ownerWindow.clearTimeout(timeoutId);
        node.removeEventListener("animationstart", handleAnimationStart);
        node.removeEventListener("animationcancel", handleAnimationEnd);
        node.removeEventListener("animationend", handleAnimationEnd);
      };
    } else {
      send("ANIMATION_END");
    }
  }, [node, send]);
  return {
    isPresent: ["mounted", "unmountSuspended"].includes(state),
    ref: react__WEBPACK_IMPORTED_MODULE_0__.useCallback((node2) => {
      stylesRef.current = node2 ? getComputedStyle(node2) : null;
      setNode(node2);
    }, [])
  };
}
function getAnimationName(styles) {
  return styles?.animationName || "none";
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
var Root = (/* unused pure expression or super */ null && (Presence));

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 15585:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WV": () => (/* binding */ Primitive),
/* harmony export */   "jH": () => (/* binding */ dispatchDiscreteCustomEvent)
/* harmony export */ });
/* unused harmony export Root */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98704);
/* harmony import */ var _radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(59818);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(56786);
// src/primitive.tsx




var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = (0,_radix_ui_react_slot__WEBPACK_IMPORTED_MODULE_3__/* .createSlot */ .Z8)(`Primitive.${node}`);
  const Node = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(() => target.dispatchEvent(event));
}
var Root = (/* unused pure expression or super */ null && (Primitive));

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 59818:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z8": () => (/* binding */ createSlot),
/* harmony export */   "sA": () => (/* binding */ createSlottable)
/* harmony export */ });
/* unused harmony exports Root, Slot, Slottable */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(49837);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(56786);
// src/slot.tsx



// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (react__WEBPACK_IMPORTED_MODULE_0__.Children.count(newElement) > 1) return react__WEBPACK_IMPORTED_MODULE_0__.Children.only(null);
          return react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children: react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(newElement) ? react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
var Slot = /* @__PURE__ */ (/* unused pure expression or super */ null && (createSlot("Slot")));
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== react__WEBPACK_IMPORTED_MODULE_0__.Fragment) {
        props2.ref = forwardedRef ? (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_2__/* .composeRefs */ .F)(forwardedRef, childrenRef) : childrenRef;
      }
      return react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(children, props2);
    }
    return react__WEBPACK_IMPORTED_MODULE_0__.Children.count(children) > 1 ? react__WEBPACK_IMPORTED_MODULE_0__.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function createSlottable(ownerName) {
  const Slottable2 = ({ children }) => {
    return /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, { children });
  };
  Slottable2.displayName = `${ownerName}.Slottable`;
  Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
  return Slottable2;
}
var Slottable = /* @__PURE__ */ (/* unused pure expression or super */ null && (createSlottable("Slottable")));
function isSlottable(child) {
  return react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 36679:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "aU": () => (/* binding */ Action),
  "x8": () => (/* binding */ Close),
  "dk": () => (/* binding */ Description),
  "zt": () => (/* binding */ Provider),
  "fC": () => (/* binding */ Root2),
  "Dx": () => (/* binding */ Title),
  "l_": () => (/* binding */ Viewport)
});

// UNUSED EXPORTS: Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport, createToastScope

// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: external "next/dist/compiled/react-dom/server-rendering-stub"
var server_rendering_stub_ = __webpack_require__(98704);
// EXTERNAL MODULE: ./node_modules/@radix-ui/primitive/dist/index.mjs
var dist = __webpack_require__(14958);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-compose-refs/dist/index.mjs
var react_compose_refs_dist = __webpack_require__(49837);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-collection/dist/index.mjs
var react_collection_dist = __webpack_require__(25580);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-context/dist/index.mjs
var react_context_dist = __webpack_require__(95866);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs + 1 modules
var react_dismissable_layer_dist = __webpack_require__(85009);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-portal/dist/index.mjs
var react_portal_dist = __webpack_require__(23214);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-presence/dist/index.mjs
var react_presence_dist = __webpack_require__(84261);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-primitive/dist/index.mjs
var react_primitive_dist = __webpack_require__(15585);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
var react_use_callback_ref_dist = __webpack_require__(76601);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
var react_use_controllable_state_dist = __webpack_require__(64352);
// EXTERNAL MODULE: ./node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
var react_use_layout_effect_dist = __webpack_require__(72660);
// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
;// CONCATENATED MODULE: ./node_modules/@radix-ui/react-visually-hidden/dist/index.mjs
// src/visually-hidden.tsx



var VISUALLY_HIDDEN_STYLES = Object.freeze({
  // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  wordWrap: "normal"
});
var NAME = "VisuallyHidden";
var VisuallyHidden = react_.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ (0,jsx_runtime_.jsx)(
      react_primitive_dist/* Primitive.span */.WV.span,
      {
        ...props,
        ref: forwardedRef,
        style: { ...VISUALLY_HIDDEN_STYLES, ...props.style }
      }
    );
  }
);
VisuallyHidden.displayName = NAME;
var Root = (/* unused pure expression or super */ null && (VisuallyHidden));

//# sourceMappingURL=index.mjs.map

;// CONCATENATED MODULE: ./node_modules/@radix-ui/react-toast/dist/index.mjs
"use client";

// src/toast.tsx















var PROVIDER_NAME = "ToastProvider";
var [Collection, useCollection, createCollectionScope] = (0,react_collection_dist/* createCollection */.B)("Toast");
var [createToastContext, createToastScope] = (0,react_context_dist/* createContextScope */.b)("Toast", [createCollectionScope]);
var [ToastProviderProvider, useToastProviderContext] = createToastContext(PROVIDER_NAME);
var ToastProvider = (props) => {
  const {
    __scopeToast,
    label = "Notification",
    duration = 5e3,
    swipeDirection = "right",
    swipeThreshold = 50,
    children
  } = props;
  const [viewport, setViewport] = react_.useState(null);
  const [toastCount, setToastCount] = react_.useState(0);
  const isFocusedToastEscapeKeyDownRef = react_.useRef(false);
  const isClosePausedRef = react_.useRef(false);
  if (!label.trim()) {
    console.error(
      `Invalid prop \`label\` supplied to \`${PROVIDER_NAME}\`. Expected non-empty \`string\`.`
    );
  }
  return /* @__PURE__ */ (0,jsx_runtime_.jsx)(Collection.Provider, { scope: __scopeToast, children: /* @__PURE__ */ (0,jsx_runtime_.jsx)(
    ToastProviderProvider,
    {
      scope: __scopeToast,
      label,
      duration,
      swipeDirection,
      swipeThreshold,
      toastCount,
      viewport,
      onViewportChange: setViewport,
      onToastAdd: react_.useCallback(() => setToastCount((prevCount) => prevCount + 1), []),
      onToastRemove: react_.useCallback(() => setToastCount((prevCount) => prevCount - 1), []),
      isFocusedToastEscapeKeyDownRef,
      isClosePausedRef,
      children
    }
  ) });
};
ToastProvider.displayName = PROVIDER_NAME;
var VIEWPORT_NAME = "ToastViewport";
var VIEWPORT_DEFAULT_HOTKEY = ["F8"];
var VIEWPORT_PAUSE = "toast.viewportPause";
var VIEWPORT_RESUME = "toast.viewportResume";
var ToastViewport = react_.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeToast,
      hotkey = VIEWPORT_DEFAULT_HOTKEY,
      label = "Notifications ({hotkey})",
      ...viewportProps
    } = props;
    const context = useToastProviderContext(VIEWPORT_NAME, __scopeToast);
    const getItems = useCollection(__scopeToast);
    const wrapperRef = react_.useRef(null);
    const headFocusProxyRef = react_.useRef(null);
    const tailFocusProxyRef = react_.useRef(null);
    const ref = react_.useRef(null);
    const composedRefs = (0,react_compose_refs_dist/* useComposedRefs */.e)(forwardedRef, ref, context.onViewportChange);
    const hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
    const hasToasts = context.toastCount > 0;
    react_.useEffect(() => {
      const handleKeyDown = (event) => {
        const isHotkeyPressed = hotkey.length !== 0 && hotkey.every((key) => event[key] || event.code === key);
        if (isHotkeyPressed) ref.current?.focus();
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [hotkey]);
    react_.useEffect(() => {
      const wrapper = wrapperRef.current;
      const viewport = ref.current;
      if (hasToasts && wrapper && viewport) {
        const handlePause = () => {
          if (!context.isClosePausedRef.current) {
            const pauseEvent = new CustomEvent(VIEWPORT_PAUSE);
            viewport.dispatchEvent(pauseEvent);
            context.isClosePausedRef.current = true;
          }
        };
        const handleResume = () => {
          if (context.isClosePausedRef.current) {
            const resumeEvent = new CustomEvent(VIEWPORT_RESUME);
            viewport.dispatchEvent(resumeEvent);
            context.isClosePausedRef.current = false;
          }
        };
        const handleFocusOutResume = (event) => {
          const isFocusMovingOutside = !wrapper.contains(event.relatedTarget);
          if (isFocusMovingOutside) handleResume();
        };
        const handlePointerLeaveResume = () => {
          const isFocusInside = wrapper.contains(document.activeElement);
          if (!isFocusInside) handleResume();
        };
        wrapper.addEventListener("focusin", handlePause);
        wrapper.addEventListener("focusout", handleFocusOutResume);
        wrapper.addEventListener("pointermove", handlePause);
        wrapper.addEventListener("pointerleave", handlePointerLeaveResume);
        window.addEventListener("blur", handlePause);
        window.addEventListener("focus", handleResume);
        return () => {
          wrapper.removeEventListener("focusin", handlePause);
          wrapper.removeEventListener("focusout", handleFocusOutResume);
          wrapper.removeEventListener("pointermove", handlePause);
          wrapper.removeEventListener("pointerleave", handlePointerLeaveResume);
          window.removeEventListener("blur", handlePause);
          window.removeEventListener("focus", handleResume);
        };
      }
    }, [hasToasts, context.isClosePausedRef]);
    const getSortedTabbableCandidates = react_.useCallback(
      ({ tabbingDirection }) => {
        const toastItems = getItems();
        const tabbableCandidates = toastItems.map((toastItem) => {
          const toastNode = toastItem.ref.current;
          const toastTabbableCandidates = [toastNode, ...getTabbableCandidates(toastNode)];
          return tabbingDirection === "forwards" ? toastTabbableCandidates : toastTabbableCandidates.reverse();
        });
        return (tabbingDirection === "forwards" ? tabbableCandidates.reverse() : tabbableCandidates).flat();
      },
      [getItems]
    );
    react_.useEffect(() => {
      const viewport = ref.current;
      if (viewport) {
        const handleKeyDown = (event) => {
          const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
          const isTabKey = event.key === "Tab" && !isMetaKey;
          if (isTabKey) {
            const focusedElement = document.activeElement;
            const isTabbingBackwards = event.shiftKey;
            const targetIsViewport = event.target === viewport;
            if (targetIsViewport && isTabbingBackwards) {
              headFocusProxyRef.current?.focus();
              return;
            }
            const tabbingDirection = isTabbingBackwards ? "backwards" : "forwards";
            const sortedCandidates = getSortedTabbableCandidates({ tabbingDirection });
            const index = sortedCandidates.findIndex((candidate) => candidate === focusedElement);
            if (focusFirst(sortedCandidates.slice(index + 1))) {
              event.preventDefault();
            } else {
              isTabbingBackwards ? headFocusProxyRef.current?.focus() : tailFocusProxyRef.current?.focus();
            }
          }
        };
        viewport.addEventListener("keydown", handleKeyDown);
        return () => viewport.removeEventListener("keydown", handleKeyDown);
      }
    }, [getItems, getSortedTabbableCandidates]);
    return /* @__PURE__ */ (0,jsx_runtime_.jsxs)(
      react_dismissable_layer_dist/* Branch */.I0,
      {
        ref: wrapperRef,
        role: "region",
        "aria-label": label.replace("{hotkey}", hotkeyLabel),
        tabIndex: -1,
        style: { pointerEvents: hasToasts ? void 0 : "none" },
        children: [
          hasToasts && /* @__PURE__ */ (0,jsx_runtime_.jsx)(
            FocusProxy,
            {
              ref: headFocusProxyRef,
              onFocusFromOutsideViewport: () => {
                const tabbableCandidates = getSortedTabbableCandidates({
                  tabbingDirection: "forwards"
                });
                focusFirst(tabbableCandidates);
              }
            }
          ),
          /* @__PURE__ */ (0,jsx_runtime_.jsx)(Collection.Slot, { scope: __scopeToast, children: /* @__PURE__ */ (0,jsx_runtime_.jsx)(react_primitive_dist/* Primitive.ol */.WV.ol, { tabIndex: -1, ...viewportProps, ref: composedRefs }) }),
          hasToasts && /* @__PURE__ */ (0,jsx_runtime_.jsx)(
            FocusProxy,
            {
              ref: tailFocusProxyRef,
              onFocusFromOutsideViewport: () => {
                const tabbableCandidates = getSortedTabbableCandidates({
                  tabbingDirection: "backwards"
                });
                focusFirst(tabbableCandidates);
              }
            }
          )
        ]
      }
    );
  }
);
ToastViewport.displayName = VIEWPORT_NAME;
var FOCUS_PROXY_NAME = "ToastFocusProxy";
var FocusProxy = react_.forwardRef(
  (props, forwardedRef) => {
    const { __scopeToast, onFocusFromOutsideViewport, ...proxyProps } = props;
    const context = useToastProviderContext(FOCUS_PROXY_NAME, __scopeToast);
    return /* @__PURE__ */ (0,jsx_runtime_.jsx)(
      VisuallyHidden,
      {
        tabIndex: 0,
        ...proxyProps,
        ref: forwardedRef,
        style: { position: "fixed" },
        onFocus: (event) => {
          const prevFocusedElement = event.relatedTarget;
          const isFocusFromOutsideViewport = !context.viewport?.contains(prevFocusedElement);
          if (isFocusFromOutsideViewport) onFocusFromOutsideViewport();
        }
      }
    );
  }
);
FocusProxy.displayName = FOCUS_PROXY_NAME;
var TOAST_NAME = "Toast";
var TOAST_SWIPE_START = "toast.swipeStart";
var TOAST_SWIPE_MOVE = "toast.swipeMove";
var TOAST_SWIPE_CANCEL = "toast.swipeCancel";
var TOAST_SWIPE_END = "toast.swipeEnd";
var Toast = react_.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, open: openProp, defaultOpen, onOpenChange, ...toastProps } = props;
    const [open, setOpen] = (0,react_use_controllable_state_dist/* useControllableState */.T)({
      prop: openProp,
      defaultProp: defaultOpen ?? true,
      onChange: onOpenChange,
      caller: TOAST_NAME
    });
    return /* @__PURE__ */ (0,jsx_runtime_.jsx)(react_presence_dist/* Presence */.z, { present: forceMount || open, children: /* @__PURE__ */ (0,jsx_runtime_.jsx)(
      ToastImpl,
      {
        open,
        ...toastProps,
        ref: forwardedRef,
        onClose: () => setOpen(false),
        onPause: (0,react_use_callback_ref_dist/* useCallbackRef */.W)(props.onPause),
        onResume: (0,react_use_callback_ref_dist/* useCallbackRef */.W)(props.onResume),
        onSwipeStart: (0,dist/* composeEventHandlers */.Mj)(props.onSwipeStart, (event) => {
          event.currentTarget.setAttribute("data-swipe", "start");
        }),
        onSwipeMove: (0,dist/* composeEventHandlers */.Mj)(props.onSwipeMove, (event) => {
          const { x, y } = event.detail.delta;
          event.currentTarget.setAttribute("data-swipe", "move");
          event.currentTarget.style.setProperty("--radix-toast-swipe-move-x", `${x}px`);
          event.currentTarget.style.setProperty("--radix-toast-swipe-move-y", `${y}px`);
        }),
        onSwipeCancel: (0,dist/* composeEventHandlers */.Mj)(props.onSwipeCancel, (event) => {
          event.currentTarget.setAttribute("data-swipe", "cancel");
          event.currentTarget.style.removeProperty("--radix-toast-swipe-move-x");
          event.currentTarget.style.removeProperty("--radix-toast-swipe-move-y");
          event.currentTarget.style.removeProperty("--radix-toast-swipe-end-x");
          event.currentTarget.style.removeProperty("--radix-toast-swipe-end-y");
        }),
        onSwipeEnd: (0,dist/* composeEventHandlers */.Mj)(props.onSwipeEnd, (event) => {
          const { x, y } = event.detail.delta;
          event.currentTarget.setAttribute("data-swipe", "end");
          event.currentTarget.style.removeProperty("--radix-toast-swipe-move-x");
          event.currentTarget.style.removeProperty("--radix-toast-swipe-move-y");
          event.currentTarget.style.setProperty("--radix-toast-swipe-end-x", `${x}px`);
          event.currentTarget.style.setProperty("--radix-toast-swipe-end-y", `${y}px`);
          setOpen(false);
        })
      }
    ) });
  }
);
Toast.displayName = TOAST_NAME;
var [ToastInteractiveProvider, useToastInteractiveContext] = createToastContext(TOAST_NAME, {
  onClose() {
  }
});
var ToastImpl = react_.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeToast,
      type = "foreground",
      duration: durationProp,
      open,
      onClose,
      onEscapeKeyDown,
      onPause,
      onResume,
      onSwipeStart,
      onSwipeMove,
      onSwipeCancel,
      onSwipeEnd,
      ...toastProps
    } = props;
    const context = useToastProviderContext(TOAST_NAME, __scopeToast);
    const [node, setNode] = react_.useState(null);
    const composedRefs = (0,react_compose_refs_dist/* useComposedRefs */.e)(forwardedRef, (node2) => setNode(node2));
    const pointerStartRef = react_.useRef(null);
    const swipeDeltaRef = react_.useRef(null);
    const duration = durationProp || context.duration;
    const closeTimerStartTimeRef = react_.useRef(0);
    const closeTimerRemainingTimeRef = react_.useRef(duration);
    const closeTimerRef = react_.useRef(0);
    const { onToastAdd, onToastRemove } = context;
    const handleClose = (0,react_use_callback_ref_dist/* useCallbackRef */.W)(() => {
      const isFocusInToast = node?.contains(document.activeElement);
      if (isFocusInToast) context.viewport?.focus();
      onClose();
    });
    const startTimer = react_.useCallback(
      (duration2) => {
        if (!duration2 || duration2 === Infinity) return;
        window.clearTimeout(closeTimerRef.current);
        closeTimerStartTimeRef.current = (/* @__PURE__ */ new Date()).getTime();
        closeTimerRef.current = window.setTimeout(handleClose, duration2);
      },
      [handleClose]
    );
    react_.useEffect(() => {
      const viewport = context.viewport;
      if (viewport) {
        const handleResume = () => {
          startTimer(closeTimerRemainingTimeRef.current);
          onResume?.();
        };
        const handlePause = () => {
          const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef.current;
          closeTimerRemainingTimeRef.current = closeTimerRemainingTimeRef.current - elapsedTime;
          window.clearTimeout(closeTimerRef.current);
          onPause?.();
        };
        viewport.addEventListener(VIEWPORT_PAUSE, handlePause);
        viewport.addEventListener(VIEWPORT_RESUME, handleResume);
        return () => {
          viewport.removeEventListener(VIEWPORT_PAUSE, handlePause);
          viewport.removeEventListener(VIEWPORT_RESUME, handleResume);
        };
      }
    }, [context.viewport, duration, onPause, onResume, startTimer]);
    react_.useEffect(() => {
      if (open && !context.isClosePausedRef.current) startTimer(duration);
    }, [open, duration, context.isClosePausedRef, startTimer]);
    react_.useEffect(() => {
      onToastAdd();
      return () => onToastRemove();
    }, [onToastAdd, onToastRemove]);
    const announceTextContent = react_.useMemo(() => {
      return node ? getAnnounceTextContent(node) : null;
    }, [node]);
    if (!context.viewport) return null;
    return /* @__PURE__ */ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, { children: [
      announceTextContent && /* @__PURE__ */ (0,jsx_runtime_.jsx)(
        ToastAnnounce,
        {
          __scopeToast,
          role: "status",
          "aria-live": type === "foreground" ? "assertive" : "polite",
          children: announceTextContent
        }
      ),
      /* @__PURE__ */ (0,jsx_runtime_.jsx)(ToastInteractiveProvider, { scope: __scopeToast, onClose: handleClose, children: server_rendering_stub_.createPortal(
        /* @__PURE__ */ (0,jsx_runtime_.jsx)(Collection.ItemSlot, { scope: __scopeToast, children: /* @__PURE__ */ (0,jsx_runtime_.jsx)(
          react_dismissable_layer_dist/* Root */.fC,
          {
            asChild: true,
            onEscapeKeyDown: (0,dist/* composeEventHandlers */.Mj)(onEscapeKeyDown, () => {
              if (!context.isFocusedToastEscapeKeyDownRef.current) handleClose();
              context.isFocusedToastEscapeKeyDownRef.current = false;
            }),
            children: /* @__PURE__ */ (0,jsx_runtime_.jsx)(
              react_primitive_dist/* Primitive.li */.WV.li,
              {
                tabIndex: 0,
                "data-state": open ? "open" : "closed",
                "data-swipe-direction": context.swipeDirection,
                ...toastProps,
                ref: composedRefs,
                style: { userSelect: "none", touchAction: "none", ...props.style },
                onKeyDown: (0,dist/* composeEventHandlers */.Mj)(props.onKeyDown, (event) => {
                  if (event.key !== "Escape") return;
                  onEscapeKeyDown?.(event.nativeEvent);
                  if (!event.nativeEvent.defaultPrevented) {
                    context.isFocusedToastEscapeKeyDownRef.current = true;
                    handleClose();
                  }
                }),
                onPointerDown: (0,dist/* composeEventHandlers */.Mj)(props.onPointerDown, (event) => {
                  if (event.button !== 0) return;
                  pointerStartRef.current = { x: event.clientX, y: event.clientY };
                }),
                onPointerMove: (0,dist/* composeEventHandlers */.Mj)(props.onPointerMove, (event) => {
                  if (!pointerStartRef.current) return;
                  const x = event.clientX - pointerStartRef.current.x;
                  const y = event.clientY - pointerStartRef.current.y;
                  const hasSwipeMoveStarted = Boolean(swipeDeltaRef.current);
                  const isHorizontalSwipe = ["left", "right"].includes(context.swipeDirection);
                  const clamp = ["left", "up"].includes(context.swipeDirection) ? Math.min : Math.max;
                  const clampedX = isHorizontalSwipe ? clamp(0, x) : 0;
                  const clampedY = !isHorizontalSwipe ? clamp(0, y) : 0;
                  const moveStartBuffer = event.pointerType === "touch" ? 10 : 2;
                  const delta = { x: clampedX, y: clampedY };
                  const eventDetail = { originalEvent: event, delta };
                  if (hasSwipeMoveStarted) {
                    swipeDeltaRef.current = delta;
                    handleAndDispatchCustomEvent(TOAST_SWIPE_MOVE, onSwipeMove, eventDetail, {
                      discrete: false
                    });
                  } else if (isDeltaInDirection(delta, context.swipeDirection, moveStartBuffer)) {
                    swipeDeltaRef.current = delta;
                    handleAndDispatchCustomEvent(TOAST_SWIPE_START, onSwipeStart, eventDetail, {
                      discrete: false
                    });
                    event.target.setPointerCapture(event.pointerId);
                  } else if (Math.abs(x) > moveStartBuffer || Math.abs(y) > moveStartBuffer) {
                    pointerStartRef.current = null;
                  }
                }),
                onPointerUp: (0,dist/* composeEventHandlers */.Mj)(props.onPointerUp, (event) => {
                  const delta = swipeDeltaRef.current;
                  const target = event.target;
                  if (target.hasPointerCapture(event.pointerId)) {
                    target.releasePointerCapture(event.pointerId);
                  }
                  swipeDeltaRef.current = null;
                  pointerStartRef.current = null;
                  if (delta) {
                    const toast = event.currentTarget;
                    const eventDetail = { originalEvent: event, delta };
                    if (isDeltaInDirection(delta, context.swipeDirection, context.swipeThreshold)) {
                      handleAndDispatchCustomEvent(TOAST_SWIPE_END, onSwipeEnd, eventDetail, {
                        discrete: true
                      });
                    } else {
                      handleAndDispatchCustomEvent(
                        TOAST_SWIPE_CANCEL,
                        onSwipeCancel,
                        eventDetail,
                        {
                          discrete: true
                        }
                      );
                    }
                    toast.addEventListener("click", (event2) => event2.preventDefault(), {
                      once: true
                    });
                  }
                })
              }
            )
          }
        ) }),
        context.viewport
      ) })
    ] });
  }
);
var ToastAnnounce = (props) => {
  const { __scopeToast, children, ...announceProps } = props;
  const context = useToastProviderContext(TOAST_NAME, __scopeToast);
  const [renderAnnounceText, setRenderAnnounceText] = react_.useState(false);
  const [isAnnounced, setIsAnnounced] = react_.useState(false);
  useNextFrame(() => setRenderAnnounceText(true));
  react_.useEffect(() => {
    const timer = window.setTimeout(() => setIsAnnounced(true), 1e3);
    return () => window.clearTimeout(timer);
  }, []);
  return isAnnounced ? null : /* @__PURE__ */ (0,jsx_runtime_.jsx)(react_portal_dist/* Portal */.h, { asChild: true, children: /* @__PURE__ */ (0,jsx_runtime_.jsx)(VisuallyHidden, { ...announceProps, children: renderAnnounceText && /* @__PURE__ */ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, { children: [
    context.label,
    " ",
    children
  ] }) }) });
};
var TITLE_NAME = "ToastTitle";
var ToastTitle = react_.forwardRef(
  (props, forwardedRef) => {
    const { __scopeToast, ...titleProps } = props;
    return /* @__PURE__ */ (0,jsx_runtime_.jsx)(react_primitive_dist/* Primitive.div */.WV.div, { ...titleProps, ref: forwardedRef });
  }
);
ToastTitle.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "ToastDescription";
var ToastDescription = react_.forwardRef(
  (props, forwardedRef) => {
    const { __scopeToast, ...descriptionProps } = props;
    return /* @__PURE__ */ (0,jsx_runtime_.jsx)(react_primitive_dist/* Primitive.div */.WV.div, { ...descriptionProps, ref: forwardedRef });
  }
);
ToastDescription.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "ToastAction";
var ToastAction = react_.forwardRef(
  (props, forwardedRef) => {
    const { altText, ...actionProps } = props;
    if (!altText.trim()) {
      console.error(
        `Invalid prop \`altText\` supplied to \`${ACTION_NAME}\`. Expected non-empty \`string\`.`
      );
      return null;
    }
    return /* @__PURE__ */ (0,jsx_runtime_.jsx)(ToastAnnounceExclude, { altText, asChild: true, children: /* @__PURE__ */ (0,jsx_runtime_.jsx)(ToastClose, { ...actionProps, ref: forwardedRef }) });
  }
);
ToastAction.displayName = ACTION_NAME;
var CLOSE_NAME = "ToastClose";
var ToastClose = react_.forwardRef(
  (props, forwardedRef) => {
    const { __scopeToast, ...closeProps } = props;
    const interactiveContext = useToastInteractiveContext(CLOSE_NAME, __scopeToast);
    return /* @__PURE__ */ (0,jsx_runtime_.jsx)(ToastAnnounceExclude, { asChild: true, children: /* @__PURE__ */ (0,jsx_runtime_.jsx)(
      react_primitive_dist/* Primitive.button */.WV.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: (0,dist/* composeEventHandlers */.Mj)(props.onClick, interactiveContext.onClose)
      }
    ) });
  }
);
ToastClose.displayName = CLOSE_NAME;
var ToastAnnounceExclude = react_.forwardRef((props, forwardedRef) => {
  const { __scopeToast, altText, ...announceExcludeProps } = props;
  return /* @__PURE__ */ (0,jsx_runtime_.jsx)(
    react_primitive_dist/* Primitive.div */.WV.div,
    {
      "data-radix-toast-announce-exclude": "",
      "data-radix-toast-announce-alt": altText || void 0,
      ...announceExcludeProps,
      ref: forwardedRef
    }
  );
});
function getAnnounceTextContent(container) {
  const textContent = [];
  const childNodes = Array.from(container.childNodes);
  childNodes.forEach((node) => {
    if (node.nodeType === node.TEXT_NODE && node.textContent) textContent.push(node.textContent);
    if (isHTMLElement(node)) {
      const isHidden = node.ariaHidden || node.hidden || node.style.display === "none";
      const isExcluded = node.dataset.radixToastAnnounceExclude === "";
      if (!isHidden) {
        if (isExcluded) {
          const altText = node.dataset.radixToastAnnounceAlt;
          if (altText) textContent.push(altText);
        } else {
          textContent.push(...getAnnounceTextContent(node));
        }
      }
    }
  });
  return textContent;
}
function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
  const currentTarget = detail.originalEvent.currentTarget;
  const event = new CustomEvent(name, { bubbles: true, cancelable: true, detail });
  if (handler) currentTarget.addEventListener(name, handler, { once: true });
  if (discrete) {
    (0,react_primitive_dist/* dispatchDiscreteCustomEvent */.jH)(currentTarget, event);
  } else {
    currentTarget.dispatchEvent(event);
  }
}
var isDeltaInDirection = (delta, direction, threshold = 0) => {
  const deltaX = Math.abs(delta.x);
  const deltaY = Math.abs(delta.y);
  const isDeltaX = deltaX > deltaY;
  if (direction === "left" || direction === "right") {
    return isDeltaX && deltaX > threshold;
  } else {
    return !isDeltaX && deltaY > threshold;
  }
};
function useNextFrame(callback = () => {
}) {
  const fn = (0,react_use_callback_ref_dist/* useCallbackRef */.W)(callback);
  (0,react_use_layout_effect_dist/* useLayoutEffect */.b)(() => {
    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => raf2 = window.requestAnimationFrame(fn));
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [fn]);
}
function isHTMLElement(node) {
  return node.nodeType === node.ELEMENT_NODE;
}
function getTabbableCandidates(container) {
  const nodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}
function focusFirst(candidates) {
  const previouslyFocusedElement = document.activeElement;
  return candidates.some((candidate) => {
    if (candidate === previouslyFocusedElement) return true;
    candidate.focus();
    return document.activeElement !== previouslyFocusedElement;
  });
}
var Provider = ToastProvider;
var Viewport = ToastViewport;
var Root2 = Toast;
var Title = ToastTitle;
var Description = ToastDescription;
var Action = ToastAction;
var Close = ToastClose;

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 76601:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "W": () => (/* binding */ useCallbackRef)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
// packages/react/use-callback-ref/src/use-callback-ref.tsx

function useCallbackRef(callback) {
  const callbackRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(callback);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    callbackRef.current = callback;
  });
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => (...args) => callbackRef.current?.(...args), []);
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 64352:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
var react__WEBPACK_IMPORTED_MODULE_0___namespace_cache;
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "T": () => (/* binding */ useControllableState)
/* harmony export */ });
/* unused harmony export useControllableStateReducer */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
/* harmony import */ var _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(72660);
// src/use-controllable-state.tsx


var useInsertionEffect = /*#__PURE__*/ (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(react__WEBPACK_IMPORTED_MODULE_0__, 2)))[" useInsertionEffect ".trim().toString()] || _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_1__/* .useLayoutEffect */ .b;
function useControllableState({
  prop,
  defaultProp,
  onChange = () => {
  },
  caller
}) {
  const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
    defaultProp,
    onChange
  });
  const isControlled = prop !== void 0;
  const value = isControlled ? prop : uncontrolledProp;
  if (true) {
    const isControlledRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(prop !== void 0);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      const wasControlled = isControlledRef.current;
      if (wasControlled !== isControlled) {
        const from = wasControlled ? "controlled" : "uncontrolled";
        const to = isControlled ? "controlled" : "uncontrolled";
        console.warn(
          `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
        );
      }
      isControlledRef.current = isControlled;
    }, [isControlled, caller]);
  }
  const setValue = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
    (nextValue) => {
      if (isControlled) {
        const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
        if (value2 !== prop) {
          onChangeRef.current?.(value2);
        }
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, onChangeRef]
  );
  return [value, setValue];
}
function useUncontrolledState({
  defaultProp,
  onChange
}) {
  const [value, setValue] = react__WEBPACK_IMPORTED_MODULE_0__.useState(defaultProp);
  const prevValueRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(value);
  const onChangeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(onChange);
  useInsertionEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    if (prevValueRef.current !== value) {
      onChangeRef.current?.(value);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef]);
  return [value, setValue, onChangeRef];
}
function isFunction(value) {
  return typeof value === "function";
}

// src/use-controllable-state-reducer.tsx


var SYNC_STATE = Symbol("RADIX:SYNC_STATE");
function useControllableStateReducer(reducer, userArgs, initialArg, init) {
  const { prop: controlledState, defaultProp, onChange: onChangeProp, caller } = userArgs;
  const isControlled = controlledState !== void 0;
  const onChange = useEffectEvent(onChangeProp);
  if (true) {
    const isControlledRef = React2.useRef(controlledState !== void 0);
    React2.useEffect(() => {
      const wasControlled = isControlledRef.current;
      if (wasControlled !== isControlled) {
        const from = wasControlled ? "controlled" : "uncontrolled";
        const to = isControlled ? "controlled" : "uncontrolled";
        console.warn(
          `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
        );
      }
      isControlledRef.current = isControlled;
    }, [isControlled, caller]);
  }
  const args = [{ ...initialArg, state: defaultProp }];
  if (init) {
    args.push(init);
  }
  const [internalState, dispatch] = React2.useReducer(
    (state2, action) => {
      if (action.type === SYNC_STATE) {
        return { ...state2, state: action.state };
      }
      const next = reducer(state2, action);
      if (isControlled && !Object.is(next.state, state2.state)) {
        onChange(next.state);
      }
      return next;
    },
    ...args
  );
  const uncontrolledState = internalState.state;
  const prevValueRef = React2.useRef(uncontrolledState);
  React2.useEffect(() => {
    if (prevValueRef.current !== uncontrolledState) {
      prevValueRef.current = uncontrolledState;
      if (!isControlled) {
        onChange(uncontrolledState);
      }
    }
  }, [onChange, uncontrolledState, prevValueRef, isControlled]);
  const state = React2.useMemo(() => {
    const isControlled2 = controlledState !== void 0;
    if (isControlled2) {
      return { ...internalState, state: controlledState };
    }
    return internalState;
  }, [internalState, controlledState]);
  React2.useEffect(() => {
    if (isControlled && !Object.is(controlledState, internalState.state)) {
      dispatch({ type: SYNC_STATE, state: controlledState });
    }
  }, [controlledState, internalState.state, isControlled]);
  return [state, dispatch];
}

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 72660:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "b": () => (/* binding */ useLayoutEffect2)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
// packages/react/use-layout-effect/src/use-layout-effect.tsx

var useLayoutEffect2 = globalThis?.document ? react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect : () => {
};

//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 97349:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "D": () => (/* binding */ C)
});

// NAMESPACE OBJECT: ./node_modules/zod/v3/external.js
var external_namespaceObject = {};
__webpack_require__.r(external_namespaceObject);
__webpack_require__.d(external_namespaceObject, {
  "BRAND": () => (types/* BRAND */.cg),
  "DIRTY": () => (parseUtil/* DIRTY */.RC),
  "EMPTY_PATH": () => (parseUtil/* EMPTY_PATH */.h2),
  "INVALID": () => (parseUtil/* INVALID */.UI),
  "NEVER": () => (types/* NEVER */.C4),
  "OK": () => (parseUtil.OK),
  "ParseStatus": () => (parseUtil/* ParseStatus */.Q9),
  "Schema": () => (types/* Schema */.V_),
  "ZodAny": () => (types/* ZodAny */.O8),
  "ZodArray": () => (types/* ZodArray */.p5),
  "ZodBigInt": () => (types/* ZodBigInt */.EG),
  "ZodBoolean": () => (types/* ZodBoolean */.pZ),
  "ZodBranded": () => (types/* ZodBranded */.Gd),
  "ZodCatch": () => (types/* ZodCatch */.ON),
  "ZodDate": () => (types/* ZodDate */.$s),
  "ZodDefault": () => (types/* ZodDefault */.uE),
  "ZodDiscriminatedUnion": () => (types/* ZodDiscriminatedUnion */.Iy),
  "ZodEffects": () => (types/* ZodEffects */.Xc),
  "ZodEnum": () => (types/* ZodEnum */.K7),
  "ZodError": () => (ZodError/* ZodError */.jm),
  "ZodFirstPartyTypeKind": () => (types/* ZodFirstPartyTypeKind */.pA),
  "ZodFunction": () => (types/* ZodFunction */.b_),
  "ZodIntersection": () => (types/* ZodIntersection */.f9),
  "ZodIssueCode": () => (ZodError/* ZodIssueCode */.NL),
  "ZodLazy": () => (types/* ZodLazy */.dT),
  "ZodLiteral": () => (types/* ZodLiteral */.SG),
  "ZodMap": () => (types/* ZodMap */.Ym),
  "ZodNaN": () => (types/* ZodNaN */.Hu),
  "ZodNativeEnum": () => (types/* ZodNativeEnum */.Zl),
  "ZodNever": () => (types/* ZodNever */.$n),
  "ZodNull": () => (types/* ZodNull */.pV),
  "ZodNullable": () => (types/* ZodNullable */.ng),
  "ZodNumber": () => (types/* ZodNumber */.IV),
  "ZodObject": () => (types/* ZodObject */.CQ),
  "ZodOptional": () => (types/* ZodOptional */.ak),
  "ZodParsedType": () => (util/* ZodParsedType */.$k),
  "ZodPipeline": () => (types/* ZodPipeline */.om),
  "ZodPromise": () => (types/* ZodPromise */.Wx),
  "ZodReadonly": () => (types/* ZodReadonly */.ur),
  "ZodRecord": () => (types/* ZodRecord */.KX),
  "ZodSchema": () => (types/* ZodSchema */.I6),
  "ZodSet": () => (types/* ZodSet */.qA),
  "ZodString": () => (types/* ZodString */.$T),
  "ZodSymbol": () => (types/* ZodSymbol */.tX),
  "ZodTransformer": () => (types/* ZodTransformer */.z2),
  "ZodTuple": () => (types/* ZodTuple */._P),
  "ZodType": () => (types/* ZodType */.DI),
  "ZodUndefined": () => (types/* ZodUndefined */.DY),
  "ZodUnion": () => (types/* ZodUnion */.jp),
  "ZodUnknown": () => (types/* ZodUnknown */.Dy),
  "ZodVoid": () => (types/* ZodVoid */.XE),
  "addIssueToContext": () => (parseUtil/* addIssueToContext */.KD),
  "any": () => (types/* any */.Yj),
  "array": () => (types/* array */.IX),
  "bigint": () => (types/* bigint */.Kv),
  "boolean": () => (types/* boolean */.O7),
  "coerce": () => (types/* coerce */.oQ),
  "custom": () => (types/* custom */.PG),
  "date": () => (types/* date */.hT),
  "datetimeRegex": () => (types/* datetimeRegex */.wU),
  "defaultErrorMap": () => (errors/* defaultErrorMap */.jY),
  "discriminatedUnion": () => (types/* discriminatedUnion */.VK),
  "effect": () => (types/* effect */.cE),
  "enum": () => (types/* enum */.Km),
  "function": () => (types/* function */.ZI),
  "getErrorMap": () => (errors/* getErrorMap */.Pr),
  "getParsedType": () => (util/* getParsedType */.FQ),
  "instanceof": () => (types/* instanceof */.Pp),
  "intersection": () => (types/* intersection */.jV),
  "isAborted": () => (parseUtil/* isAborted */.Hc),
  "isAsync": () => (parseUtil/* isAsync */.S9),
  "isDirty": () => (parseUtil/* isDirty */.eT),
  "isValid": () => (parseUtil/* isValid */.JY),
  "late": () => (types/* late */.wt),
  "lazy": () => (types/* lazy */.Vo),
  "literal": () => (types/* literal */.i0),
  "makeIssue": () => (parseUtil/* makeIssue */.Xm),
  "map": () => (types/* map */.UI),
  "nan": () => (types/* nan */.qn),
  "nativeEnum": () => (types/* nativeEnum */.jb),
  "never": () => (types/* never */.Fi),
  "null": () => (types/* null */.lB),
  "nullable": () => (types/* nullable */.AG),
  "number": () => (types/* number */.Rx),
  "object": () => (types/* object */.Ry),
  "objectUtil": () => (util/* objectUtil */.Mg),
  "oboolean": () => (types/* oboolean */.Ts),
  "onumber": () => (types/* onumber */.vs),
  "optional": () => (types/* optional */.jt),
  "ostring": () => (types/* ostring */.Dk),
  "pipeline": () => (types/* pipeline */.EU),
  "preprocess": () => (types/* preprocess */.dj),
  "promise": () => (types/* promise */.MC),
  "quotelessJson": () => (ZodError/* quotelessJson */.Zh),
  "record": () => (types/* record */.IM),
  "set": () => (types/* set */.t8),
  "setErrorMap": () => (errors/* setErrorMap */.DJ),
  "strictObject": () => (types/* strictObject */.cf),
  "string": () => (types/* string */.Z_),
  "symbol": () => (types/* symbol */.NA),
  "transformer": () => (types/* transformer */.l4),
  "tuple": () => (types/* tuple */.bc),
  "undefined": () => (types/* undefined */.S1),
  "union": () => (types/* union */.G0),
  "unknown": () => (types/* unknown */._4),
  "util": () => (util/* util */.D5),
  "void": () => (types/* void */.Hc)
});

// EXTERNAL MODULE: ./node_modules/zod/v3/errors.js
var errors = __webpack_require__(10949);
// EXTERNAL MODULE: ./node_modules/zod/v3/helpers/parseUtil.js
var parseUtil = __webpack_require__(14458);
// EXTERNAL MODULE: ./node_modules/zod/v3/helpers/util.js
var util = __webpack_require__(43882);
// EXTERNAL MODULE: ./node_modules/zod/v3/types.js + 1 modules
var types = __webpack_require__(81186);
// EXTERNAL MODULE: ./node_modules/zod/v3/ZodError.js
var ZodError = __webpack_require__(16121);
;// CONCATENATED MODULE: ./node_modules/zod/v3/external.js







;// CONCATENATED MODULE: ./node_modules/zod/index.js



/* harmony default export */ const zod = (external_namespaceObject);

;// CONCATENATED MODULE: ./node_modules/@t3-oss/env-nextjs/dist/index.mjs
function l(e){let r=e.runtimeEnvStrict??e.runtimeEnv??process.env;if(e.skipValidation??(!!process.env.SKIP_ENV_VALIDATION&&process.env.SKIP_ENV_VALIDATION!=="false"&&process.env.SKIP_ENV_VALIDATION!=="0"))return r;let a=typeof e.client=="object"?e.client:{},o=zod.object(a),v=zod.object(e.server),s=e.isServer??typeof window>"u",p=v.merge(o),i=s?p.safeParse(r):o.safeParse(r),f=e.onValidationError??(t=>{throw console.error("\u274C Invalid environment variables:",t.flatten().fieldErrors),new Error("Invalid environment variables")}),d=e.onInvalidAccess??(t=>{throw new Error("\u274C Attempted to access a server-side environment variable on the client")});return i.success===!1?f(i.error):new Proxy(i.data,{get(t,n){if(typeof n=="string")return!s&&!n.startsWith(e.clientPrefix)?d(n):t[n]}})}var T="NEXT_PUBLIC_";function C({runtimeEnv:e,...r}){return l({...r,clientPrefix:T,runtimeEnvStrict:e})}
//# sourceMappingURL=index.mjs.map

/***/ }),

/***/ 39506:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "c": () => (/* binding */ Analytics)
/* harmony export */ });
/* unused harmony export track */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
"use client";

// src/react/index.tsx


// package.json
var name = "@vercel/analytics";
var version = "1.5.0";

// src/queue.ts
var initQueue = () => {
  if (window.va) return;
  window.va = function a(...params) {
    (window.vaq = window.vaq || []).push(params);
  };
};

// src/utils.ts
function isBrowser() {
  return typeof window !== "undefined";
}
function detectEnvironment() {
  try {
    const env = "production";
    if (env === "development" || env === "test") {
      return "development";
    }
  } catch (e) {
  }
  return "production";
}
function setMode(mode = "auto") {
  if (mode === "auto") {
    window.vam = detectEnvironment();
    return;
  }
  window.vam = mode;
}
function getMode() {
  const mode = isBrowser() ? window.vam : detectEnvironment();
  return mode || "production";
}
function isProduction() {
  return getMode() === "production";
}
function isDevelopment() {
  return getMode() === "development";
}
function removeKey(key, { [key]: _, ...rest }) {
  return rest;
}
function parseProperties(properties, options) {
  if (!properties) return void 0;
  let props = properties;
  const errorProperties = [];
  for (const [key, value] of Object.entries(properties)) {
    if (typeof value === "object" && value !== null) {
      if (options.strip) {
        props = removeKey(key, props);
      } else {
        errorProperties.push(key);
      }
    }
  }
  if (errorProperties.length > 0 && !options.strip) {
    throw Error(
      `The following properties are not valid: ${errorProperties.join(
        ", "
      )}. Only strings, numbers, booleans, and null are allowed.`
    );
  }
  return props;
}
function getScriptSrc(props) {
  if (props.scriptSrc) {
    return props.scriptSrc;
  }
  if (isDevelopment()) {
    return "https://va.vercel-scripts.com/v1/script.debug.js";
  }
  if (props.basePath) {
    return `${props.basePath}/insights/script.js`;
  }
  return "/_vercel/insights/script.js";
}

// src/generic.ts
function inject(props = {
  debug: true
}) {
  var _a;
  if (!isBrowser()) return;
  setMode(props.mode);
  initQueue();
  if (props.beforeSend) {
    (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
  }
  const src = getScriptSrc(props);
  if (document.head.querySelector(`script[src*="${src}"]`)) return;
  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  script.dataset.sdkn = name + (props.framework ? `/${props.framework}` : "");
  script.dataset.sdkv = version;
  if (props.disableAutoTrack) {
    script.dataset.disableAutoTrack = "1";
  }
  if (props.endpoint) {
    script.dataset.endpoint = props.endpoint;
  } else if (props.basePath) {
    script.dataset.endpoint = `${props.basePath}/insights`;
  }
  if (props.dsn) {
    script.dataset.dsn = props.dsn;
  }
  script.onerror = () => {
    const errorMessage = isDevelopment() ? "Please check if any ad blockers are enabled and try again." : "Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";
    console.log(
      `[Vercel Web Analytics] Failed to load script from ${src}. ${errorMessage}`
    );
  };
  if (isDevelopment() && props.debug === false) {
    script.dataset.debug = "false";
  }
  document.head.appendChild(script);
}
function track(name2, properties, options) {
  var _a, _b;
  if (!isBrowser()) {
    const msg = "[Vercel Web Analytics] Please import `track` from `@vercel/analytics/server` when using this function in a server environment";
    if (isProduction()) {
      console.warn(msg);
    } else {
      throw new Error(msg);
    }
    return;
  }
  if (!properties) {
    (_a = window.va) == null ? void 0 : _a.call(window, "event", { name: name2, options });
    return;
  }
  try {
    const props = parseProperties(properties, {
      strip: isProduction()
    });
    (_b = window.va) == null ? void 0 : _b.call(window, "event", {
      name: name2,
      data: props,
      options
    });
  } catch (err) {
    if (err instanceof Error && isDevelopment()) {
      console.error(err);
    }
  }
}
function pageview({
  route,
  path
}) {
  var _a;
  (_a = window.va) == null ? void 0 : _a.call(window, "pageview", { route, path });
}

// src/react/utils.ts
function getBasePath() {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    return void 0;
  }
  return process.env.REACT_APP_VERCEL_OBSERVABILITY_BASEPATH;
}

// src/react/index.tsx
function Analytics(props) {
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    var _a;
    if (props.beforeSend) {
      (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
    }
  }, [props.beforeSend]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    inject({
      framework: props.framework || "react",
      basePath: props.basePath ?? getBasePath(),
      ...props.route !== void 0 && { disableAutoTrack: true },
      ...props
    });
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (props.route && props.path) {
      pageview({ route: props.route, path: props.path });
    }
  }, [props.route, props.path]);
  return null;
}

//# sourceMappingURL=index.mjs.map

/***/ }),

/***/ 4798:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "m": () => (/* binding */ twMerge)
});

;// CONCATENATED MODULE: ./node_modules/tailwind-merge/dist/lib/class-utils.mjs
var CLASS_PART_SEPARATOR = '-';
function createClassUtils(config) {
  var classMap = createClassMap(config);
  var conflictingClassGroups = config.conflictingClassGroups,
    _config$conflictingCl = config.conflictingClassGroupModifiers,
    conflictingClassGroupModifiers = _config$conflictingCl === void 0 ? {} : _config$conflictingCl;
  function getClassGroupId(className) {
    var classParts = className.split(CLASS_PART_SEPARATOR);
    // Classes like `-inset-1` produce an empty string as first classPart. We assume that classes for negative values are used correctly and remove it from classParts.
    if (classParts[0] === '' && classParts.length !== 1) {
      classParts.shift();
    }
    return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
  }
  function getConflictingClassGroupIds(classGroupId, hasPostfixModifier) {
    var conflicts = conflictingClassGroups[classGroupId] || [];
    if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
      return [].concat(conflicts, conflictingClassGroupModifiers[classGroupId]);
    }
    return conflicts;
  }
  return {
    getClassGroupId: getClassGroupId,
    getConflictingClassGroupIds: getConflictingClassGroupIds
  };
}
function getGroupRecursive(classParts, classPartObject) {
  if (classParts.length === 0) {
    return classPartObject.classGroupId;
  }
  var currentClassPart = classParts[0];
  var nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
  var classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : undefined;
  if (classGroupFromNextClassPart) {
    return classGroupFromNextClassPart;
  }
  if (classPartObject.validators.length === 0) {
    return undefined;
  }
  var classRest = classParts.join(CLASS_PART_SEPARATOR);
  return classPartObject.validators.find(function (_ref) {
    var validator = _ref.validator;
    return validator(classRest);
  })?.classGroupId;
}
var arbitraryPropertyRegex = /^\[(.+)\]$/;
function getGroupIdForArbitraryProperty(className) {
  if (arbitraryPropertyRegex.test(className)) {
    var arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
    var property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(':'));
    if (property) {
      // I use two dots here because one dot is used as prefix for class groups in plugins
      return 'arbitrary..' + property;
    }
  }
}
/**
 * Exported for testing only
 */
function createClassMap(config) {
  var theme = config.theme,
    prefix = config.prefix;
  var classMap = {
    nextPart: new Map(),
    validators: []
  };
  var prefixedClassGroupEntries = getPrefixedClassGroupEntries(Object.entries(config.classGroups), prefix);
  prefixedClassGroupEntries.forEach(function (_ref2) {
    var classGroupId = _ref2[0],
      classGroup = _ref2[1];
    processClassesRecursively(classGroup, classMap, classGroupId, theme);
  });
  return classMap;
}
function processClassesRecursively(classGroup, classPartObject, classGroupId, theme) {
  classGroup.forEach(function (classDefinition) {
    if (typeof classDefinition === 'string') {
      var classPartObjectToEdit = classDefinition === '' ? classPartObject : getPart(classPartObject, classDefinition);
      classPartObjectToEdit.classGroupId = classGroupId;
      return;
    }
    if (typeof classDefinition === 'function') {
      if (isThemeGetter(classDefinition)) {
        processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
        return;
      }
      classPartObject.validators.push({
        validator: classDefinition,
        classGroupId: classGroupId
      });
      return;
    }
    Object.entries(classDefinition).forEach(function (_ref3) {
      var key = _ref3[0],
        classGroup = _ref3[1];
      processClassesRecursively(classGroup, getPart(classPartObject, key), classGroupId, theme);
    });
  });
}
function getPart(classPartObject, path) {
  var currentClassPartObject = classPartObject;
  path.split(CLASS_PART_SEPARATOR).forEach(function (pathPart) {
    if (!currentClassPartObject.nextPart.has(pathPart)) {
      currentClassPartObject.nextPart.set(pathPart, {
        nextPart: new Map(),
        validators: []
      });
    }
    currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
  });
  return currentClassPartObject;
}
function isThemeGetter(func) {
  return func.isThemeGetter;
}
function getPrefixedClassGroupEntries(classGroupEntries, prefix) {
  if (!prefix) {
    return classGroupEntries;
  }
  return classGroupEntries.map(function (_ref4) {
    var classGroupId = _ref4[0],
      classGroup = _ref4[1];
    var prefixedClassGroup = classGroup.map(function (classDefinition) {
      if (typeof classDefinition === 'string') {
        return prefix + classDefinition;
      }
      if (typeof classDefinition === 'object') {
        return Object.fromEntries(Object.entries(classDefinition).map(function (_ref5) {
          var key = _ref5[0],
            value = _ref5[1];
          return [prefix + key, value];
        }));
      }
      return classDefinition;
    });
    return [classGroupId, prefixedClassGroup];
  });
}


//# sourceMappingURL=class-utils.mjs.map

;// CONCATENATED MODULE: ./node_modules/tailwind-merge/dist/lib/lru-cache.mjs
// LRU cache inspired from hashlru (https://github.com/dominictarr/hashlru/blob/v1.0.4/index.js) but object replaced with Map to improve performance
function createLruCache(maxCacheSize) {
  if (maxCacheSize < 1) {
    return {
      get: function get() {
        return undefined;
      },
      set: function set() {}
    };
  }
  var cacheSize = 0;
  var cache = new Map();
  var previousCache = new Map();
  function update(key, value) {
    cache.set(key, value);
    cacheSize++;
    if (cacheSize > maxCacheSize) {
      cacheSize = 0;
      previousCache = cache;
      cache = new Map();
    }
  }
  return {
    get: function get(key) {
      var value = cache.get(key);
      if (value !== undefined) {
        return value;
      }
      if ((value = previousCache.get(key)) !== undefined) {
        update(key, value);
        return value;
      }
    },
    set: function set(key, value) {
      if (cache.has(key)) {
        cache.set(key, value);
      } else {
        update(key, value);
      }
    }
  };
}


//# sourceMappingURL=lru-cache.mjs.map

;// CONCATENATED MODULE: ./node_modules/tailwind-merge/dist/lib/modifier-utils.mjs
var IMPORTANT_MODIFIER = '!';
function createSplitModifiers(config) {
  var separator = config.separator || ':';
  var isSeparatorSingleCharacter = separator.length === 1;
  var firstSeparatorCharacter = separator[0];
  var separatorLength = separator.length;
  // splitModifiers inspired by https://github.com/tailwindlabs/tailwindcss/blob/v3.2.2/src/util/splitAtTopLevelOnly.js
  return function splitModifiers(className) {
    var modifiers = [];
    var bracketDepth = 0;
    var modifierStart = 0;
    var postfixModifierPosition;
    for (var index = 0; index < className.length; index++) {
      var currentCharacter = className[index];
      if (bracketDepth === 0) {
        if (currentCharacter === firstSeparatorCharacter && (isSeparatorSingleCharacter || className.slice(index, index + separatorLength) === separator)) {
          modifiers.push(className.slice(modifierStart, index));
          modifierStart = index + separatorLength;
          continue;
        }
        if (currentCharacter === '/') {
          postfixModifierPosition = index;
          continue;
        }
      }
      if (currentCharacter === '[') {
        bracketDepth++;
      } else if (currentCharacter === ']') {
        bracketDepth--;
      }
    }
    var baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
    var hasImportantModifier = baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER);
    var baseClassName = hasImportantModifier ? baseClassNameWithImportantModifier.substring(1) : baseClassNameWithImportantModifier;
    var maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : undefined;
    return {
      modifiers: modifiers,
      hasImportantModifier: hasImportantModifier,
      baseClassName: baseClassName,
      maybePostfixModifierPosition: maybePostfixModifierPosition
    };
  };
}
/**
 * Sorts modifiers according to following schema:
 * - Predefined modifiers are sorted alphabetically
 * - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
 */
function sortModifiers(modifiers) {
  if (modifiers.length <= 1) {
    return modifiers;
  }
  var sortedModifiers = [];
  var unsortedModifiers = [];
  modifiers.forEach(function (modifier) {
    var isArbitraryVariant = modifier[0] === '[';
    if (isArbitraryVariant) {
      sortedModifiers.push.apply(sortedModifiers, unsortedModifiers.sort().concat([modifier]));
      unsortedModifiers = [];
    } else {
      unsortedModifiers.push(modifier);
    }
  });
  sortedModifiers.push.apply(sortedModifiers, unsortedModifiers.sort());
  return sortedModifiers;
}


//# sourceMappingURL=modifier-utils.mjs.map

;// CONCATENATED MODULE: ./node_modules/tailwind-merge/dist/lib/config-utils.mjs




function createConfigUtils(config) {
  return {
    cache: createLruCache(config.cacheSize),
    splitModifiers: createSplitModifiers(config),
    ...createClassUtils(config)
  };
}


//# sourceMappingURL=config-utils.mjs.map

;// CONCATENATED MODULE: ./node_modules/tailwind-merge/dist/lib/merge-classlist.mjs


var SPLIT_CLASSES_REGEX = /\s+/;
function mergeClassList(classList, configUtils) {
  var splitModifiers = configUtils.splitModifiers,
    getClassGroupId = configUtils.getClassGroupId,
    getConflictingClassGroupIds = configUtils.getConflictingClassGroupIds;
  /**
   * Set of classGroupIds in following format:
   * `{importantModifier}{variantModifiers}{classGroupId}`
   * @example 'float'
   * @example 'hover:focus:bg-color'
   * @example 'md:!pr'
   */
  var classGroupsInConflict = new Set();
  return classList.trim().split(SPLIT_CLASSES_REGEX).map(function (originalClassName) {
    var _splitModifiers = splitModifiers(originalClassName),
      modifiers = _splitModifiers.modifiers,
      hasImportantModifier = _splitModifiers.hasImportantModifier,
      baseClassName = _splitModifiers.baseClassName,
      maybePostfixModifierPosition = _splitModifiers.maybePostfixModifierPosition;
    var classGroupId = getClassGroupId(maybePostfixModifierPosition ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
    var hasPostfixModifier = Boolean(maybePostfixModifierPosition);
    if (!classGroupId) {
      if (!maybePostfixModifierPosition) {
        return {
          isTailwindClass: false,
          originalClassName: originalClassName
        };
      }
      classGroupId = getClassGroupId(baseClassName);
      if (!classGroupId) {
        return {
          isTailwindClass: false,
          originalClassName: originalClassName
        };
      }
      hasPostfixModifier = false;
    }
    var variantModifier = sortModifiers(modifiers).join(':');
    var modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
    return {
      isTailwindClass: true,
      modifierId: modifierId,
      classGroupId: classGroupId,
      originalClassName: originalClassName,
      hasPostfixModifier: hasPostfixModifier
    };
  }).reverse()
  // Last class in conflict wins, so we need to filter conflicting classes in reverse order.
  .filter(function (parsed) {
    if (!parsed.isTailwindClass) {
      return true;
    }
    var modifierId = parsed.modifierId,
      classGroupId = parsed.classGroupId,
      hasPostfixModifier = parsed.hasPostfixModifier;
    var classId = modifierId + classGroupId;
    if (classGroupsInConflict.has(classId)) {
      return false;
    }
    classGroupsInConflict.add(classId);
    getConflictingClassGroupIds(classGroupId, hasPostfixModifier).forEach(function (group) {
      return classGroupsInConflict.add(modifierId + group);
    });
    return true;
  }).reverse().map(function (parsed) {
    return parsed.originalClassName;
  }).join(' ');
}


//# sourceMappingURL=merge-classlist.mjs.map

;// CONCATENATED MODULE: ./node_modules/tailwind-merge/dist/lib/tw-join.mjs
/**
 * The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
 *
 * Specifically:
 * - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
 * - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
 *
 * Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 */
function twJoin() {
  var index = 0;
  var argument;
  var resolvedValue;
  var string = '';
  while (index < arguments.length) {
    if (argument = arguments[index++]) {
      if (resolvedValue = toValue(argument)) {
        string && (string += ' ');
        string += resolvedValue;
      }
    }
  }
  return string;
}
function toValue(mix) {
  if (typeof mix === 'string') {
    return mix;
  }
  var resolvedValue;
  var string = '';
  for (var k = 0; k < mix.length; k++) {
    if (mix[k]) {
      if (resolvedValue = toValue(mix[k])) {
        string && (string += ' ');
        string += resolvedValue;
      }
    }
  }
  return string;
}


//# sourceMappingURL=tw-join.mjs.map

;// CONCATENATED MODULE: ./node_modules/tailwind-merge/dist/lib/create-tailwind-merge.mjs




function createTailwindMerge() {
  for (var _len = arguments.length, createConfig = new Array(_len), _key = 0; _key < _len; _key++) {
    createConfig[_key] = arguments[_key];
  }
  var configUtils;
  var cacheGet;
  var cacheSet;
  var functionToCall = initTailwindMerge;
  function initTailwindMerge(classList) {
    var firstCreateConfig = createConfig[0],
      restCreateConfig = createConfig.slice(1);
    var config = restCreateConfig.reduce(function (previousConfig, createConfigCurrent) {
      return createConfigCurrent(previousConfig);
    }, firstCreateConfig());
    configUtils = createConfigUtils(config);
    cacheGet = configUtils.cache.get;
    cacheSet = configUtils.cache.set;
    functionToCall = tailwindMerge;
    return tailwindMerge(classList);
  }
  function tailwindMerge(classList) {
    var cachedResult = cacheGet(classList);
    if (cachedResult) {
      return cachedResult;
    }
    var result = mergeClassList(classList, configUtils);
    cacheSet(classList, result);
    return result;
  }
  return function callTailwindMerge() {
    return functionToCall(twJoin.apply(null, arguments));
  };
}


//# sourceMappingURL=create-tailwind-merge.mjs.map

;// CONCATENATED MODULE: ./node_modules/tailwind-merge/dist/lib/from-theme.mjs
function fromTheme(key) {
  var themeGetter = function themeGetter(theme) {
    return theme[key] || [];
  };
  themeGetter.isThemeGetter = true;
  return themeGetter;
}


//# sourceMappingURL=from-theme.mjs.map

;// CONCATENATED MODULE: ./node_modules/tailwind-merge/dist/lib/validators.mjs
var arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i;
var fractionRegex = /^\d+\/\d+$/;
var stringLengths = /*#__PURE__*/new Set(['px', 'full', 'screen']);
var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
// Shadow always begins with x and y offset separated by underscore
var shadowRegex = /^-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
function isLength(value) {
  return isNumber(value) || stringLengths.has(value) || fractionRegex.test(value) || isArbitraryLength(value);
}
function isArbitraryLength(value) {
  return getIsArbitraryValue(value, 'length', isLengthOnly);
}
function isArbitrarySize(value) {
  return getIsArbitraryValue(value, 'size', isNever);
}
function isArbitraryPosition(value) {
  return getIsArbitraryValue(value, 'position', isNever);
}
function isArbitraryUrl(value) {
  return getIsArbitraryValue(value, 'url', isUrl);
}
function isArbitraryNumber(value) {
  return getIsArbitraryValue(value, 'number', isNumber);
}
/**
 * @deprecated Will be removed in next major version. Use `isArbitraryNumber` instead.
 */
var isArbitraryWeight = (/* unused pure expression or super */ null && (isArbitraryNumber));
function isNumber(value) {
  return !Number.isNaN(Number(value));
}
function isPercent(value) {
  return value.endsWith('%') && isNumber(value.slice(0, -1));
}
function isInteger(value) {
  return isIntegerOnly(value) || getIsArbitraryValue(value, 'number', isIntegerOnly);
}
function isArbitraryValue(value) {
  return arbitraryValueRegex.test(value);
}
function isAny() {
  return true;
}
function isTshirtSize(value) {
  return tshirtUnitRegex.test(value);
}
function isArbitraryShadow(value) {
  return getIsArbitraryValue(value, '', isShadow);
}
function getIsArbitraryValue(value, label, testValue) {
  var result = arbitraryValueRegex.exec(value);
  if (result) {
    if (result[1]) {
      return result[1] === label;
    }
    return testValue(result[2]);
  }
  return false;
}
function isLengthOnly(value) {
  return lengthUnitRegex.test(value);
}
function isNever() {
  return false;
}
function isUrl(value) {
  return value.startsWith('url(');
}
function isIntegerOnly(value) {
  return Number.isInteger(Number(value));
}
function isShadow(value) {
  return shadowRegex.test(value);
}


//# sourceMappingURL=validators.mjs.map

;// CONCATENATED MODULE: ./node_modules/tailwind-merge/dist/lib/default-config.mjs



function getDefaultConfig() {
  var colors = fromTheme('colors');
  var spacing = fromTheme('spacing');
  var blur = fromTheme('blur');
  var brightness = fromTheme('brightness');
  var borderColor = fromTheme('borderColor');
  var borderRadius = fromTheme('borderRadius');
  var borderSpacing = fromTheme('borderSpacing');
  var borderWidth = fromTheme('borderWidth');
  var contrast = fromTheme('contrast');
  var grayscale = fromTheme('grayscale');
  var hueRotate = fromTheme('hueRotate');
  var invert = fromTheme('invert');
  var gap = fromTheme('gap');
  var gradientColorStops = fromTheme('gradientColorStops');
  var gradientColorStopPositions = fromTheme('gradientColorStopPositions');
  var inset = fromTheme('inset');
  var margin = fromTheme('margin');
  var opacity = fromTheme('opacity');
  var padding = fromTheme('padding');
  var saturate = fromTheme('saturate');
  var scale = fromTheme('scale');
  var sepia = fromTheme('sepia');
  var skew = fromTheme('skew');
  var space = fromTheme('space');
  var translate = fromTheme('translate');
  var getOverscroll = function getOverscroll() {
    return ['auto', 'contain', 'none'];
  };
  var getOverflow = function getOverflow() {
    return ['auto', 'hidden', 'clip', 'visible', 'scroll'];
  };
  var getSpacingWithAutoAndArbitrary = function getSpacingWithAutoAndArbitrary() {
    return ['auto', isArbitraryValue, spacing];
  };
  var getSpacingWithArbitrary = function getSpacingWithArbitrary() {
    return [isArbitraryValue, spacing];
  };
  var getLengthWithEmpty = function getLengthWithEmpty() {
    return ['', isLength];
  };
  var getNumberWithAutoAndArbitrary = function getNumberWithAutoAndArbitrary() {
    return ['auto', isNumber, isArbitraryValue];
  };
  var getPositions = function getPositions() {
    return ['bottom', 'center', 'left', 'left-bottom', 'left-top', 'right', 'right-bottom', 'right-top', 'top'];
  };
  var getLineStyles = function getLineStyles() {
    return ['solid', 'dashed', 'dotted', 'double', 'none'];
  };
  var getBlendModes = function getBlendModes() {
    return ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity', 'plus-lighter'];
  };
  var getAlign = function getAlign() {
    return ['start', 'end', 'center', 'between', 'around', 'evenly', 'stretch'];
  };
  var getZeroAndEmpty = function getZeroAndEmpty() {
    return ['', '0', isArbitraryValue];
  };
  var getBreaks = function getBreaks() {
    return ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'];
  };
  var getNumber = function getNumber() {
    return [isNumber, isArbitraryNumber];
  };
  var getNumberAndArbitrary = function getNumberAndArbitrary() {
    return [isNumber, isArbitraryValue];
  };
  return {
    cacheSize: 500,
    theme: {
      colors: [isAny],
      spacing: [isLength],
      blur: ['none', '', isTshirtSize, isArbitraryValue],
      brightness: getNumber(),
      borderColor: [colors],
      borderRadius: ['none', '', 'full', isTshirtSize, isArbitraryValue],
      borderSpacing: getSpacingWithArbitrary(),
      borderWidth: getLengthWithEmpty(),
      contrast: getNumber(),
      grayscale: getZeroAndEmpty(),
      hueRotate: getNumberAndArbitrary(),
      invert: getZeroAndEmpty(),
      gap: getSpacingWithArbitrary(),
      gradientColorStops: [colors],
      gradientColorStopPositions: [isPercent, isArbitraryLength],
      inset: getSpacingWithAutoAndArbitrary(),
      margin: getSpacingWithAutoAndArbitrary(),
      opacity: getNumber(),
      padding: getSpacingWithArbitrary(),
      saturate: getNumber(),
      scale: getNumber(),
      sepia: getZeroAndEmpty(),
      skew: getNumberAndArbitrary(),
      space: getSpacingWithArbitrary(),
      translate: getSpacingWithArbitrary()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ['auto', 'square', 'video', isArbitraryValue]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ['container'],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [isTshirtSize]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      'break-after': [{
        'break-after': getBreaks()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      'break-before': [{
        'break-before': getBreaks()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      'break-inside': [{
        'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column']
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      'box-decoration': [{
        'box-decoration': ['slice', 'clone']
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ['border', 'content']
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'table', 'inline-table', 'table-caption', 'table-cell', 'table-column', 'table-column-group', 'table-footer-group', 'table-header-group', 'table-row-group', 'table-row', 'flow-root', 'grid', 'inline-grid', 'contents', 'list-item', 'hidden'],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      "float": [{
        "float": ['right', 'left', 'none']
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ['left', 'right', 'both', 'none']
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ['isolate', 'isolation-auto'],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      'object-fit': [{
        object: ['contain', 'cover', 'fill', 'none', 'scale-down']
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      'object-position': [{
        object: [].concat(getPositions(), [isArbitraryValue])
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: getOverflow()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      'overflow-x': [{
        'overflow-x': getOverflow()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      'overflow-y': [{
        'overflow-y': getOverflow()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: getOverscroll()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      'overscroll-x': [{
        'overscroll-x': getOverscroll()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      'overscroll-y': [{
        'overscroll-y': getOverscroll()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [inset]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      'inset-x': [{
        'inset-x': [inset]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      'inset-y': [{
        'inset-y': [inset]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [inset]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [inset]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [inset]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [inset]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [inset]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [inset]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ['visible', 'invisible', 'collapse'],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ['auto', isInteger]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: getSpacingWithAutoAndArbitrary()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      'flex-direction': [{
        flex: ['row', 'row-reverse', 'col', 'col-reverse']
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      'flex-wrap': [{
        flex: ['wrap', 'wrap-reverse', 'nowrap']
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ['1', 'auto', 'initial', 'none', isArbitraryValue]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: getZeroAndEmpty()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: getZeroAndEmpty()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ['first', 'last', 'none', isInteger]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      'grid-cols': [{
        'grid-cols': [isAny]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-start-end': [{
        col: ['auto', {
          span: ['full', isInteger]
        }, isArbitraryValue]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-start': [{
        'col-start': getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-end': [{
        'col-end': getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      'grid-rows': [{
        'grid-rows': [isAny]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-start-end': [{
        row: ['auto', {
          span: [isInteger]
        }, isArbitraryValue]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-start': [{
        'row-start': getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-end': [{
        'row-end': getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      'grid-flow': [{
        'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense']
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      'auto-cols': [{
        'auto-cols': ['auto', 'min', 'max', 'fr', isArbitraryValue]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      'auto-rows': [{
        'auto-rows': ['auto', 'min', 'max', 'fr', isArbitraryValue]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [gap]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      'gap-x': [{
        'gap-x': [gap]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      'gap-y': [{
        'gap-y': [gap]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      'justify-content': [{
        justify: ['normal'].concat(getAlign())
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      'justify-items': [{
        'justify-items': ['start', 'end', 'center', 'stretch']
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      'justify-self': [{
        'justify-self': ['auto', 'start', 'end', 'center', 'stretch']
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      'align-content': [{
        content: ['normal'].concat(getAlign(), ['baseline'])
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      'align-items': [{
        items: ['start', 'end', 'center', 'baseline', 'stretch']
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      'align-self': [{
        self: ['auto', 'start', 'end', 'center', 'stretch', 'baseline']
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      'place-content': [{
        'place-content': [].concat(getAlign(), ['baseline'])
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      'place-items': [{
        'place-items': ['start', 'end', 'center', 'baseline', 'stretch']
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      'place-self': [{
        'place-self': ['auto', 'start', 'end', 'center', 'stretch']
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [padding]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [padding]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [padding]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [padding]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [padding]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [padding]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [padding]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [padding]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [padding]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [margin]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [margin]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [margin]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [margin]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [margin]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [margin]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [margin]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [margin]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [margin]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      'space-x': [{
        'space-x': [space]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      'space-x-reverse': ['space-x-reverse'],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      'space-y': [{
        'space-y': [space]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      'space-y-reverse': ['space-y-reverse'],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ['auto', 'min', 'max', 'fit', isArbitraryValue, spacing]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      'min-w': [{
        'min-w': ['min', 'max', 'fit', isArbitraryValue, isLength]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      'max-w': [{
        'max-w': ['0', 'none', 'full', 'min', 'max', 'fit', 'prose', {
          screen: [isTshirtSize]
        }, isTshirtSize, isArbitraryValue]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [isArbitraryValue, spacing, 'auto', 'min', 'max', 'fit']
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      'min-h': [{
        'min-h': ['min', 'max', 'fit', isArbitraryValue, isLength]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      'max-h': [{
        'max-h': [isArbitraryValue, spacing, 'min', 'max', 'fit']
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      'font-size': [{
        text: ['base', isTshirtSize, isArbitraryLength]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      'font-smoothing': ['antialiased', 'subpixel-antialiased'],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      'font-style': ['italic', 'not-italic'],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      'font-weight': [{
        font: ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black', isArbitraryNumber]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      'font-family': [{
        font: [isAny]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-normal': ['normal-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-ordinal': ['ordinal'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-slashed-zero': ['slashed-zero'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-figure': ['lining-nums', 'oldstyle-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-spacing': ['proportional-nums', 'tabular-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-fraction': ['diagonal-fractions', 'stacked-fractons'],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest', isArbitraryValue]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      'line-clamp': [{
        'line-clamp': ['none', isNumber, isArbitraryNumber]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose', isArbitraryValue, isLength]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      'list-image': [{
        'list-image': ['none', isArbitraryValue]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      'list-style-type': [{
        list: ['none', 'disc', 'decimal', isArbitraryValue]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      'list-style-position': [{
        list: ['inside', 'outside']
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      'placeholder-color': [{
        placeholder: [colors]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      'placeholder-opacity': [{
        'placeholder-opacity': [opacity]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      'text-alignment': [{
        text: ['left', 'center', 'right', 'justify', 'start', 'end']
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      'text-color': [{
        text: [colors]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      'text-opacity': [{
        'text-opacity': [opacity]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      'text-decoration-style': [{
        decoration: [].concat(getLineStyles(), ['wavy'])
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      'text-decoration-thickness': [{
        decoration: ['auto', 'from-font', isLength]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      'underline-offset': [{
        'underline-offset': ['auto', isArbitraryValue, isLength]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      'text-decoration-color': [{
        decoration: [colors]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: getSpacingWithArbitrary()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      'vertical-align': [{
        align: ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom', 'sub', 'super', isArbitraryValue]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces']
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      "break": [{
        "break": ['normal', 'words', 'all', 'keep']
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ['none', 'manual', 'auto']
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ['none', isArbitraryValue]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      'bg-attachment': [{
        bg: ['fixed', 'local', 'scroll']
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      'bg-clip': [{
        'bg-clip': ['border', 'padding', 'content', 'text']
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      'bg-opacity': [{
        'bg-opacity': [opacity]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      'bg-origin': [{
        'bg-origin': ['border', 'padding', 'content']
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      'bg-position': [{
        bg: [].concat(getPositions(), [isArbitraryPosition])
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      'bg-repeat': [{
        bg: ['no-repeat', {
          repeat: ['', 'x', 'y', 'round', 'space']
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      'bg-size': [{
        bg: ['auto', 'cover', 'contain', isArbitrarySize]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      'bg-image': [{
        bg: ['none', {
          'gradient-to': ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']
        }, isArbitraryUrl]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      'bg-color': [{
        bg: [colors]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-from-pos': [{
        from: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-via-pos': [{
        via: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-to-pos': [{
        to: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-from': [{
        from: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-via': [{
        via: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-to': [{
        to: [gradientColorStops]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [borderRadius]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-s': [{
        'rounded-s': [borderRadius]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-e': [{
        'rounded-e': [borderRadius]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-t': [{
        'rounded-t': [borderRadius]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-r': [{
        'rounded-r': [borderRadius]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-b': [{
        'rounded-b': [borderRadius]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-l': [{
        'rounded-l': [borderRadius]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-ss': [{
        'rounded-ss': [borderRadius]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-se': [{
        'rounded-se': [borderRadius]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-ee': [{
        'rounded-ee': [borderRadius]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-es': [{
        'rounded-es': [borderRadius]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-tl': [{
        'rounded-tl': [borderRadius]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-tr': [{
        'rounded-tr': [borderRadius]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-br': [{
        'rounded-br': [borderRadius]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-bl': [{
        'rounded-bl': [borderRadius]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w': [{
        border: [borderWidth]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-x': [{
        'border-x': [borderWidth]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-y': [{
        'border-y': [borderWidth]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-s': [{
        'border-s': [borderWidth]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-e': [{
        'border-e': [borderWidth]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-t': [{
        'border-t': [borderWidth]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-r': [{
        'border-r': [borderWidth]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-b': [{
        'border-b': [borderWidth]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-l': [{
        'border-l': [borderWidth]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      'border-opacity': [{
        'border-opacity': [opacity]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      'border-style': [{
        border: [].concat(getLineStyles(), ['hidden'])
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-x': [{
        'divide-x': [borderWidth]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-x-reverse': ['divide-x-reverse'],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-y': [{
        'divide-y': [borderWidth]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      'divide-y-reverse': ['divide-y-reverse'],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      'divide-opacity': [{
        'divide-opacity': [opacity]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      'divide-style': [{
        divide: getLineStyles()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color': [{
        border: [borderColor]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-x': [{
        'border-x': [borderColor]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-y': [{
        'border-y': [borderColor]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-t': [{
        'border-t': [borderColor]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-r': [{
        'border-r': [borderColor]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-b': [{
        'border-b': [borderColor]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-l': [{
        'border-l': [borderColor]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      'divide-color': [{
        divide: [borderColor]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      'outline-style': [{
        outline: [''].concat(getLineStyles())
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      'outline-offset': [{
        'outline-offset': [isArbitraryValue, isLength]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      'outline-w': [{
        outline: [isLength]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      'outline-color': [{
        outline: [colors]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      'ring-w': [{
        ring: getLengthWithEmpty()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      'ring-w-inset': ['ring-inset'],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      'ring-color': [{
        ring: [colors]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      'ring-opacity': [{
        'ring-opacity': [opacity]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      'ring-offset-w': [{
        'ring-offset': [isLength]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      'ring-offset-color': [{
        'ring-offset': [colors]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ['', 'inner', 'none', isTshirtSize, isArbitraryShadow]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      'shadow-color': [{
        shadow: [isAny]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [opacity]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      'mix-blend': [{
        'mix-blend': getBlendModes()
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      'bg-blend': [{
        'bg-blend': getBlendModes()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ['', 'none']
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [blur]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [brightness]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [contrast]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      'drop-shadow': [{
        'drop-shadow': ['', 'none', isTshirtSize, isArbitraryValue]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [grayscale]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      'hue-rotate': [{
        'hue-rotate': [hueRotate]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [invert]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [saturate]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [sepia]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      'backdrop-filter': [{
        'backdrop-filter': ['', 'none']
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      'backdrop-blur': [{
        'backdrop-blur': [blur]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      'backdrop-brightness': [{
        'backdrop-brightness': [brightness]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      'backdrop-contrast': [{
        'backdrop-contrast': [contrast]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      'backdrop-grayscale': [{
        'backdrop-grayscale': [grayscale]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      'backdrop-hue-rotate': [{
        'backdrop-hue-rotate': [hueRotate]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      'backdrop-invert': [{
        'backdrop-invert': [invert]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      'backdrop-opacity': [{
        'backdrop-opacity': [opacity]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      'backdrop-saturate': [{
        'backdrop-saturate': [saturate]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      'backdrop-sepia': [{
        'backdrop-sepia': [sepia]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      'border-collapse': [{
        border: ['collapse', 'separate']
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing': [{
        'border-spacing': [borderSpacing]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing-x': [{
        'border-spacing-x': [borderSpacing]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing-y': [{
        'border-spacing-y': [borderSpacing]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      'table-layout': [{
        table: ['auto', 'fixed']
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ['top', 'bottom']
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ['none', 'all', '', 'colors', 'opacity', 'shadow', 'transform', isArbitraryValue]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: getNumberAndArbitrary()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ['linear', 'in', 'out', 'in-out', isArbitraryValue]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: getNumberAndArbitrary()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ['none', 'spin', 'ping', 'pulse', 'bounce', isArbitraryValue]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ['', 'gpu', 'none']
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [scale]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-x': [{
        'scale-x': [scale]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-y': [{
        'scale-y': [scale]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [isInteger, isArbitraryValue]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-x': [{
        'translate-x': [translate]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-y': [{
        'translate-y': [translate]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      'skew-x': [{
        'skew-x': [skew]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      'skew-y': [{
        'skew-y': [skew]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      'transform-origin': [{
        origin: ['center', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left', isArbitraryValue]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ['auto', colors]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: ['appearance-none'],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ['auto', 'default', 'pointer', 'wait', 'text', 'move', 'help', 'not-allowed', 'none', 'context-menu', 'progress', 'cell', 'crosshair', 'vertical-text', 'alias', 'copy', 'no-drop', 'grab', 'grabbing', 'all-scroll', 'col-resize', 'row-resize', 'n-resize', 'e-resize', 's-resize', 'w-resize', 'ne-resize', 'nw-resize', 'se-resize', 'sw-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'zoom-in', 'zoom-out', isArbitraryValue]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      'caret-color': [{
        caret: [colors]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      'pointer-events': [{
        'pointer-events': ['none', 'auto']
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ['none', 'y', 'x', '']
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      'scroll-behavior': [{
        scroll: ['auto', 'smooth']
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-m': [{
        'scroll-m': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mx': [{
        'scroll-mx': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-my': [{
        'scroll-my': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-ms': [{
        'scroll-ms': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-me': [{
        'scroll-me': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mt': [{
        'scroll-mt': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mr': [{
        'scroll-mr': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mb': [{
        'scroll-mb': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-ml': [{
        'scroll-ml': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-p': [{
        'scroll-p': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-px': [{
        'scroll-px': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-py': [{
        'scroll-py': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-ps': [{
        'scroll-ps': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pe': [{
        'scroll-pe': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pt': [{
        'scroll-pt': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pr': [{
        'scroll-pr': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pb': [{
        'scroll-pb': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pl': [{
        'scroll-pl': getSpacingWithArbitrary()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      'snap-align': [{
        snap: ['start', 'end', 'center', 'align-none']
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      'snap-stop': [{
        snap: ['normal', 'always']
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      'snap-type': [{
        snap: ['none', 'x', 'y', 'both']
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      'snap-strictness': [{
        snap: ['mandatory', 'proximity']
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ['auto', 'none', 'pinch-zoom', 'manipulation', {
          pan: ['x', 'left', 'right', 'y', 'up', 'down']
        }]
      }],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ['none', 'text', 'all', 'auto']
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      'will-change': [{
        'will-change': ['auto', 'scroll', 'contents', 'transform', isArbitraryValue]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [colors, 'none']
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      'stroke-w': [{
        stroke: [isLength, isArbitraryNumber]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [colors, 'none']
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ['sr-only', 'not-sr-only']
    },
    conflictingClassGroups: {
      overflow: ['overflow-x', 'overflow-y'],
      overscroll: ['overscroll-x', 'overscroll-y'],
      inset: ['inset-x', 'inset-y', 'start', 'end', 'top', 'right', 'bottom', 'left'],
      'inset-x': ['right', 'left'],
      'inset-y': ['top', 'bottom'],
      flex: ['basis', 'grow', 'shrink'],
      gap: ['gap-x', 'gap-y'],
      p: ['px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl'],
      px: ['pr', 'pl'],
      py: ['pt', 'pb'],
      m: ['mx', 'my', 'ms', 'me', 'mt', 'mr', 'mb', 'ml'],
      mx: ['mr', 'ml'],
      my: ['mt', 'mb'],
      'font-size': ['leading'],
      'fvn-normal': ['fvn-ordinal', 'fvn-slashed-zero', 'fvn-figure', 'fvn-spacing', 'fvn-fraction'],
      'fvn-ordinal': ['fvn-normal'],
      'fvn-slashed-zero': ['fvn-normal'],
      'fvn-figure': ['fvn-normal'],
      'fvn-spacing': ['fvn-normal'],
      'fvn-fraction': ['fvn-normal'],
      rounded: ['rounded-s', 'rounded-e', 'rounded-t', 'rounded-r', 'rounded-b', 'rounded-l', 'rounded-ss', 'rounded-se', 'rounded-ee', 'rounded-es', 'rounded-tl', 'rounded-tr', 'rounded-br', 'rounded-bl'],
      'rounded-s': ['rounded-ss', 'rounded-es'],
      'rounded-e': ['rounded-se', 'rounded-ee'],
      'rounded-t': ['rounded-tl', 'rounded-tr'],
      'rounded-r': ['rounded-tr', 'rounded-br'],
      'rounded-b': ['rounded-br', 'rounded-bl'],
      'rounded-l': ['rounded-tl', 'rounded-bl'],
      'border-spacing': ['border-spacing-x', 'border-spacing-y'],
      'border-w': ['border-w-s', 'border-w-e', 'border-w-t', 'border-w-r', 'border-w-b', 'border-w-l'],
      'border-w-x': ['border-w-r', 'border-w-l'],
      'border-w-y': ['border-w-t', 'border-w-b'],
      'border-color': ['border-color-t', 'border-color-r', 'border-color-b', 'border-color-l'],
      'border-color-x': ['border-color-r', 'border-color-l'],
      'border-color-y': ['border-color-t', 'border-color-b'],
      'scroll-m': ['scroll-mx', 'scroll-my', 'scroll-ms', 'scroll-me', 'scroll-mt', 'scroll-mr', 'scroll-mb', 'scroll-ml'],
      'scroll-mx': ['scroll-mr', 'scroll-ml'],
      'scroll-my': ['scroll-mt', 'scroll-mb'],
      'scroll-p': ['scroll-px', 'scroll-py', 'scroll-ps', 'scroll-pe', 'scroll-pt', 'scroll-pr', 'scroll-pb', 'scroll-pl'],
      'scroll-px': ['scroll-pr', 'scroll-pl'],
      'scroll-py': ['scroll-pt', 'scroll-pb']
    },
    conflictingClassGroupModifiers: {
      'font-size': ['leading']
    }
  };
}


//# sourceMappingURL=default-config.mjs.map

;// CONCATENATED MODULE: ./node_modules/tailwind-merge/dist/lib/tw-merge.mjs



var twMerge = /*#__PURE__*/createTailwindMerge(getDefaultConfig);


//# sourceMappingURL=tw-merge.mjs.map


/***/ }),

/***/ 16121:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NL": () => (/* binding */ ZodIssueCode),
/* harmony export */   "Zh": () => (/* binding */ quotelessJson),
/* harmony export */   "jm": () => (/* binding */ ZodError)
/* harmony export */ });
/* harmony import */ var _helpers_util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43882);

const ZodIssueCode = _helpers_util_js__WEBPACK_IMPORTED_MODULE_0__/* .util.arrayToEnum */ .D5.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite",
]);
const quotelessJson = (obj) => {
    const json = JSON.stringify(obj, null, 2);
    return json.replace(/"([^"]+)":/g, "$1:");
};
class ZodError extends Error {
    get errors() {
        return this.issues;
    }
    constructor(issues) {
        super();
        this.issues = [];
        this.addIssue = (sub) => {
            this.issues = [...this.issues, sub];
        };
        this.addIssues = (subs = []) => {
            this.issues = [...this.issues, ...subs];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            // eslint-disable-next-line ban/ban
            Object.setPrototypeOf(this, actualProto);
        }
        else {
            this.__proto__ = actualProto;
        }
        this.name = "ZodError";
        this.issues = issues;
    }
    format(_mapper) {
        const mapper = _mapper ||
            function (issue) {
                return issue.message;
            };
        const fieldErrors = { _errors: [] };
        const processError = (error) => {
            for (const issue of error.issues) {
                if (issue.code === "invalid_union") {
                    issue.unionErrors.map(processError);
                }
                else if (issue.code === "invalid_return_type") {
                    processError(issue.returnTypeError);
                }
                else if (issue.code === "invalid_arguments") {
                    processError(issue.argumentsError);
                }
                else if (issue.path.length === 0) {
                    fieldErrors._errors.push(mapper(issue));
                }
                else {
                    let curr = fieldErrors;
                    let i = 0;
                    while (i < issue.path.length) {
                        const el = issue.path[i];
                        const terminal = i === issue.path.length - 1;
                        if (!terminal) {
                            curr[el] = curr[el] || { _errors: [] };
                            // if (typeof el === "string") {
                            //   curr[el] = curr[el] || { _errors: [] };
                            // } else if (typeof el === "number") {
                            //   const errorArray: any = [];
                            //   errorArray._errors = [];
                            //   curr[el] = curr[el] || errorArray;
                            // }
                        }
                        else {
                            curr[el] = curr[el] || { _errors: [] };
                            curr[el]._errors.push(mapper(issue));
                        }
                        curr = curr[el];
                        i++;
                    }
                }
            }
        };
        processError(this);
        return fieldErrors;
    }
    static assert(value) {
        if (!(value instanceof ZodError)) {
            throw new Error(`Not a ZodError: ${value}`);
        }
    }
    toString() {
        return this.message;
    }
    get message() {
        return JSON.stringify(this.issues, _helpers_util_js__WEBPACK_IMPORTED_MODULE_0__/* .util.jsonStringifyReplacer */ .D5.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
        return this.issues.length === 0;
    }
    flatten(mapper = (issue) => issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues) {
            if (sub.path.length > 0) {
                const firstEl = sub.path[0];
                fieldErrors[firstEl] = fieldErrors[firstEl] || [];
                fieldErrors[firstEl].push(mapper(sub));
            }
            else {
                formErrors.push(mapper(sub));
            }
        }
        return { formErrors, fieldErrors };
    }
    get formErrors() {
        return this.flatten();
    }
}
ZodError.create = (issues) => {
    const error = new ZodError(issues);
    return error;
};


/***/ }),

/***/ 10949:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DJ": () => (/* binding */ setErrorMap),
/* harmony export */   "Pr": () => (/* binding */ getErrorMap),
/* harmony export */   "jY": () => (/* reexport safe */ _locales_en_js__WEBPACK_IMPORTED_MODULE_0__.Z)
/* harmony export */ });
/* harmony import */ var _locales_en_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5387);

let overrideErrorMap = _locales_en_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z;

function setErrorMap(map) {
    overrideErrorMap = map;
}
function getErrorMap() {
    return overrideErrorMap;
}


/***/ }),

/***/ 14458:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Hc": () => (/* binding */ isAborted),
/* harmony export */   "JY": () => (/* binding */ isValid),
/* harmony export */   "KD": () => (/* binding */ addIssueToContext),
/* harmony export */   "OK": () => (/* binding */ OK),
/* harmony export */   "Q9": () => (/* binding */ ParseStatus),
/* harmony export */   "RC": () => (/* binding */ DIRTY),
/* harmony export */   "S9": () => (/* binding */ isAsync),
/* harmony export */   "UI": () => (/* binding */ INVALID),
/* harmony export */   "Xm": () => (/* binding */ makeIssue),
/* harmony export */   "eT": () => (/* binding */ isDirty),
/* harmony export */   "h2": () => (/* binding */ EMPTY_PATH)
/* harmony export */ });
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10949);
/* harmony import */ var _locales_en_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5387);


const makeIssue = (params) => {
    const { data, path, errorMaps, issueData } = params;
    const fullPath = [...path, ...(issueData.path || [])];
    const fullIssue = {
        ...issueData,
        path: fullPath,
    };
    if (issueData.message !== undefined) {
        return {
            ...issueData,
            path: fullPath,
            message: issueData.message,
        };
    }
    let errorMessage = "";
    const maps = errorMaps
        .filter((m) => !!m)
        .slice()
        .reverse();
    for (const map of maps) {
        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
    }
    return {
        ...issueData,
        path: fullPath,
        message: errorMessage,
    };
};
const EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
    const overrideMap = (0,_errors_js__WEBPACK_IMPORTED_MODULE_0__/* .getErrorMap */ .Pr)();
    const issue = makeIssue({
        issueData: issueData,
        data: ctx.data,
        path: ctx.path,
        errorMaps: [
            ctx.common.contextualErrorMap, // contextual error map is first priority
            ctx.schemaErrorMap, // then schema-bound map if available
            overrideMap, // then global override map
            overrideMap === _locales_en_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z ? undefined : _locales_en_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z, // then global default map
        ].filter((x) => !!x),
    });
    ctx.common.issues.push(issue);
}
class ParseStatus {
    constructor() {
        this.value = "valid";
    }
    dirty() {
        if (this.value === "valid")
            this.value = "dirty";
    }
    abort() {
        if (this.value !== "aborted")
            this.value = "aborted";
    }
    static mergeArray(status, results) {
        const arrayValue = [];
        for (const s of results) {
            if (s.status === "aborted")
                return INVALID;
            if (s.status === "dirty")
                status.dirty();
            arrayValue.push(s.value);
        }
        return { status: status.value, value: arrayValue };
    }
    static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            syncPairs.push({
                key,
                value,
            });
        }
        return ParseStatus.mergeObjectSync(status, syncPairs);
    }
    static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs) {
            const { key, value } = pair;
            if (key.status === "aborted")
                return INVALID;
            if (value.status === "aborted")
                return INVALID;
            if (key.status === "dirty")
                status.dirty();
            if (value.status === "dirty")
                status.dirty();
            if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
                finalObject[key.value] = value.value;
            }
        }
        return { status: status.value, value: finalObject };
    }
}
const INVALID = Object.freeze({
    status: "aborted",
});
const DIRTY = (value) => ({ status: "dirty", value });
const OK = (value) => ({ status: "valid", value });
const isAborted = (x) => x.status === "aborted";
const isDirty = (x) => x.status === "dirty";
const isValid = (x) => x.status === "valid";
const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;


/***/ }),

/***/ 43882:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$k": () => (/* binding */ ZodParsedType),
/* harmony export */   "D5": () => (/* binding */ util),
/* harmony export */   "FQ": () => (/* binding */ getParsedType),
/* harmony export */   "Mg": () => (/* binding */ objectUtil)
/* harmony export */ });
var util;
(function (util) {
    util.assertEqual = (_) => { };
    function assertIs(_arg) { }
    util.assertIs = assertIs;
    function assertNever(_x) {
        throw new Error();
    }
    util.assertNever = assertNever;
    util.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) {
            obj[item] = item;
        }
        return obj;
    };
    util.getValidEnumValues = (obj) => {
        const validKeys = util.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys) {
            filtered[k] = obj[k];
        }
        return util.objectValues(filtered);
    };
    util.objectValues = (obj) => {
        return util.objectKeys(obj).map(function (e) {
            return obj[e];
        });
    };
    util.objectKeys = typeof Object.keys === "function" // eslint-disable-line ban/ban
        ? (obj) => Object.keys(obj) // eslint-disable-line ban/ban
        : (object) => {
            const keys = [];
            for (const key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
    util.find = (arr, checker) => {
        for (const item of arr) {
            if (checker(item))
                return item;
        }
        return undefined;
    };
    util.isInteger = typeof Number.isInteger === "function"
        ? (val) => Number.isInteger(val) // eslint-disable-line ban/ban
        : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
    function joinValues(array, separator = " | ") {
        return array.map((val) => (typeof val === "string" ? `'${val}'` : val)).join(separator);
    }
    util.joinValues = joinValues;
    util.jsonStringifyReplacer = (_, value) => {
        if (typeof value === "bigint") {
            return value.toString();
        }
        return value;
    };
})(util || (util = {}));
var objectUtil;
(function (objectUtil) {
    objectUtil.mergeShapes = (first, second) => {
        return {
            ...first,
            ...second, // second overwrites first
        };
    };
})(objectUtil || (objectUtil = {}));
const ZodParsedType = util.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set",
]);
const getParsedType = (data) => {
    const t = typeof data;
    switch (t) {
        case "undefined":
            return ZodParsedType.undefined;
        case "string":
            return ZodParsedType.string;
        case "number":
            return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
        case "boolean":
            return ZodParsedType.boolean;
        case "function":
            return ZodParsedType.function;
        case "bigint":
            return ZodParsedType.bigint;
        case "symbol":
            return ZodParsedType.symbol;
        case "object":
            if (Array.isArray(data)) {
                return ZodParsedType.array;
            }
            if (data === null) {
                return ZodParsedType.null;
            }
            if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
                return ZodParsedType.promise;
            }
            if (typeof Map !== "undefined" && data instanceof Map) {
                return ZodParsedType.map;
            }
            if (typeof Set !== "undefined" && data instanceof Set) {
                return ZodParsedType.set;
            }
            if (typeof Date !== "undefined" && data instanceof Date) {
                return ZodParsedType.date;
            }
            return ZodParsedType.object;
        default:
            return ZodParsedType.unknown;
    }
};


/***/ }),

/***/ 5387:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ZodError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16121);
/* harmony import */ var _helpers_util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(43882);


const errorMap = (issue, _ctx) => {
    let message;
    switch (issue.code) {
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.invalid_type */ .NL.invalid_type:
            if (issue.received === _helpers_util_js__WEBPACK_IMPORTED_MODULE_1__/* .ZodParsedType.undefined */ .$k.undefined) {
                message = "Required";
            }
            else {
                message = `Expected ${issue.expected}, received ${issue.received}`;
            }
            break;
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.invalid_literal */ .NL.invalid_literal:
            message = `Invalid literal value, expected ${JSON.stringify(issue.expected, _helpers_util_js__WEBPACK_IMPORTED_MODULE_1__/* .util.jsonStringifyReplacer */ .D5.jsonStringifyReplacer)}`;
            break;
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.unrecognized_keys */ .NL.unrecognized_keys:
            message = `Unrecognized key(s) in object: ${_helpers_util_js__WEBPACK_IMPORTED_MODULE_1__/* .util.joinValues */ .D5.joinValues(issue.keys, ", ")}`;
            break;
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.invalid_union */ .NL.invalid_union:
            message = `Invalid input`;
            break;
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.invalid_union_discriminator */ .NL.invalid_union_discriminator:
            message = `Invalid discriminator value. Expected ${_helpers_util_js__WEBPACK_IMPORTED_MODULE_1__/* .util.joinValues */ .D5.joinValues(issue.options)}`;
            break;
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.invalid_enum_value */ .NL.invalid_enum_value:
            message = `Invalid enum value. Expected ${_helpers_util_js__WEBPACK_IMPORTED_MODULE_1__/* .util.joinValues */ .D5.joinValues(issue.options)}, received '${issue.received}'`;
            break;
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.invalid_arguments */ .NL.invalid_arguments:
            message = `Invalid function arguments`;
            break;
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.invalid_return_type */ .NL.invalid_return_type:
            message = `Invalid function return type`;
            break;
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.invalid_date */ .NL.invalid_date:
            message = `Invalid date`;
            break;
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.invalid_string */ .NL.invalid_string:
            if (typeof issue.validation === "object") {
                if ("includes" in issue.validation) {
                    message = `Invalid input: must include "${issue.validation.includes}"`;
                    if (typeof issue.validation.position === "number") {
                        message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
                    }
                }
                else if ("startsWith" in issue.validation) {
                    message = `Invalid input: must start with "${issue.validation.startsWith}"`;
                }
                else if ("endsWith" in issue.validation) {
                    message = `Invalid input: must end with "${issue.validation.endsWith}"`;
                }
                else {
                    _helpers_util_js__WEBPACK_IMPORTED_MODULE_1__/* .util.assertNever */ .D5.assertNever(issue.validation);
                }
            }
            else if (issue.validation !== "regex") {
                message = `Invalid ${issue.validation}`;
            }
            else {
                message = "Invalid";
            }
            break;
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.too_small */ .NL.too_small:
            if (issue.type === "array")
                message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
            else if (issue.type === "string")
                message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
            else if (issue.type === "number")
                message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
            else if (issue.type === "bigint")
                message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
            else if (issue.type === "date")
                message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
            else
                message = "Invalid input";
            break;
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.too_big */ .NL.too_big:
            if (issue.type === "array")
                message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
            else if (issue.type === "string")
                message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
            else if (issue.type === "number")
                message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
            else if (issue.type === "bigint")
                message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
            else if (issue.type === "date")
                message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
            else
                message = "Invalid input";
            break;
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.custom */ .NL.custom:
            message = `Invalid input`;
            break;
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.invalid_intersection_types */ .NL.invalid_intersection_types:
            message = `Intersection results could not be merged`;
            break;
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.not_multiple_of */ .NL.not_multiple_of:
            message = `Number must be a multiple of ${issue.multipleOf}`;
            break;
        case _ZodError_js__WEBPACK_IMPORTED_MODULE_0__/* .ZodIssueCode.not_finite */ .NL.not_finite:
            message = "Number must be finite";
            break;
        default:
            message = _ctx.defaultError;
            _helpers_util_js__WEBPACK_IMPORTED_MODULE_1__/* .util.assertNever */ .D5.assertNever(issue);
    }
    return { message };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (errorMap);


/***/ }),

/***/ 81186:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "cg": () => (/* binding */ BRAND),
  "C4": () => (/* binding */ NEVER),
  "V_": () => (/* binding */ ZodType),
  "O8": () => (/* binding */ ZodAny),
  "p5": () => (/* binding */ ZodArray),
  "EG": () => (/* binding */ ZodBigInt),
  "pZ": () => (/* binding */ ZodBoolean),
  "Gd": () => (/* binding */ ZodBranded),
  "ON": () => (/* binding */ ZodCatch),
  "$s": () => (/* binding */ ZodDate),
  "uE": () => (/* binding */ ZodDefault),
  "Iy": () => (/* binding */ ZodDiscriminatedUnion),
  "Xc": () => (/* binding */ ZodEffects),
  "K7": () => (/* binding */ ZodEnum),
  "pA": () => (/* binding */ ZodFirstPartyTypeKind),
  "b_": () => (/* binding */ ZodFunction),
  "f9": () => (/* binding */ ZodIntersection),
  "dT": () => (/* binding */ ZodLazy),
  "SG": () => (/* binding */ ZodLiteral),
  "Ym": () => (/* binding */ ZodMap),
  "Hu": () => (/* binding */ ZodNaN),
  "Zl": () => (/* binding */ ZodNativeEnum),
  "$n": () => (/* binding */ ZodNever),
  "pV": () => (/* binding */ ZodNull),
  "ng": () => (/* binding */ ZodNullable),
  "IV": () => (/* binding */ ZodNumber),
  "CQ": () => (/* binding */ ZodObject),
  "ak": () => (/* binding */ ZodOptional),
  "om": () => (/* binding */ ZodPipeline),
  "Wx": () => (/* binding */ ZodPromise),
  "ur": () => (/* binding */ ZodReadonly),
  "KX": () => (/* binding */ ZodRecord),
  "I6": () => (/* binding */ ZodType),
  "qA": () => (/* binding */ ZodSet),
  "$T": () => (/* binding */ ZodString),
  "tX": () => (/* binding */ ZodSymbol),
  "z2": () => (/* binding */ ZodEffects),
  "_P": () => (/* binding */ ZodTuple),
  "DI": () => (/* binding */ ZodType),
  "DY": () => (/* binding */ ZodUndefined),
  "jp": () => (/* binding */ ZodUnion),
  "Dy": () => (/* binding */ ZodUnknown),
  "XE": () => (/* binding */ ZodVoid),
  "Yj": () => (/* binding */ anyType),
  "IX": () => (/* binding */ arrayType),
  "Kv": () => (/* binding */ bigIntType),
  "O7": () => (/* binding */ booleanType),
  "oQ": () => (/* binding */ coerce),
  "PG": () => (/* binding */ custom),
  "hT": () => (/* binding */ dateType),
  "wU": () => (/* binding */ datetimeRegex),
  "VK": () => (/* binding */ discriminatedUnionType),
  "cE": () => (/* binding */ effectsType),
  "Km": () => (/* binding */ enumType),
  "ZI": () => (/* binding */ functionType),
  "Pp": () => (/* binding */ instanceOfType),
  "jV": () => (/* binding */ intersectionType),
  "wt": () => (/* binding */ late),
  "Vo": () => (/* binding */ lazyType),
  "i0": () => (/* binding */ literalType),
  "UI": () => (/* binding */ mapType),
  "qn": () => (/* binding */ nanType),
  "jb": () => (/* binding */ nativeEnumType),
  "Fi": () => (/* binding */ neverType),
  "lB": () => (/* binding */ nullType),
  "AG": () => (/* binding */ nullableType),
  "Rx": () => (/* binding */ numberType),
  "Ry": () => (/* binding */ objectType),
  "Ts": () => (/* binding */ oboolean),
  "vs": () => (/* binding */ onumber),
  "jt": () => (/* binding */ optionalType),
  "Dk": () => (/* binding */ ostring),
  "EU": () => (/* binding */ pipelineType),
  "dj": () => (/* binding */ preprocessType),
  "MC": () => (/* binding */ promiseType),
  "IM": () => (/* binding */ recordType),
  "t8": () => (/* binding */ setType),
  "cf": () => (/* binding */ strictObjectType),
  "Z_": () => (/* binding */ stringType),
  "NA": () => (/* binding */ symbolType),
  "l4": () => (/* binding */ effectsType),
  "bc": () => (/* binding */ tupleType),
  "S1": () => (/* binding */ undefinedType),
  "G0": () => (/* binding */ unionType),
  "_4": () => (/* binding */ unknownType),
  "Hc": () => (/* binding */ voidType)
});

// EXTERNAL MODULE: ./node_modules/zod/v3/ZodError.js
var ZodError = __webpack_require__(16121);
// EXTERNAL MODULE: ./node_modules/zod/v3/errors.js
var errors = __webpack_require__(10949);
// EXTERNAL MODULE: ./node_modules/zod/v3/locales/en.js
var en = __webpack_require__(5387);
;// CONCATENATED MODULE: ./node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function (errorUtil) {
    errorUtil.errToObj = (message) => typeof message === "string" ? { message } : message || {};
    // biome-ignore lint:
    errorUtil.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// EXTERNAL MODULE: ./node_modules/zod/v3/helpers/parseUtil.js
var parseUtil = __webpack_require__(14458);
// EXTERNAL MODULE: ./node_modules/zod/v3/helpers/util.js
var util = __webpack_require__(43882);
;// CONCATENATED MODULE: ./node_modules/zod/v3/types.js





class ParseInputLazyPath {
    constructor(parent, value, path, key) {
        this._cachedPath = [];
        this.parent = parent;
        this.data = value;
        this._path = path;
        this._key = key;
    }
    get path() {
        if (!this._cachedPath.length) {
            if (Array.isArray(this._key)) {
                this._cachedPath.push(...this._path, ...this._key);
            }
            else {
                this._cachedPath.push(...this._path, this._key);
            }
        }
        return this._cachedPath;
    }
}
const handleResult = (ctx, result) => {
    if ((0,parseUtil/* isValid */.JY)(result)) {
        return { success: true, data: result.value };
    }
    else {
        if (!ctx.common.issues.length) {
            throw new Error("Validation failed but no issues detected.");
        }
        return {
            success: false,
            get error() {
                if (this._error)
                    return this._error;
                const error = new ZodError/* ZodError */.jm(ctx.common.issues);
                this._error = error;
                return this._error;
            },
        };
    }
};
function processCreateParams(params) {
    if (!params)
        return {};
    const { errorMap, invalid_type_error, required_error, description } = params;
    if (errorMap && (invalid_type_error || required_error)) {
        throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    }
    if (errorMap)
        return { errorMap: errorMap, description };
    const customMap = (iss, ctx) => {
        const { message } = params;
        if (iss.code === "invalid_enum_value") {
            return { message: message ?? ctx.defaultError };
        }
        if (typeof ctx.data === "undefined") {
            return { message: message ?? required_error ?? ctx.defaultError };
        }
        if (iss.code !== "invalid_type")
            return { message: ctx.defaultError };
        return { message: message ?? invalid_type_error ?? ctx.defaultError };
    };
    return { errorMap: customMap, description };
}
class ZodType {
    get description() {
        return this._def.description;
    }
    _getType(input) {
        return (0,util/* getParsedType */.FQ)(input.data);
    }
    _getOrReturnCtx(input, ctx) {
        return (ctx || {
            common: input.parent.common,
            data: input.data,
            parsedType: (0,util/* getParsedType */.FQ)(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent,
        });
    }
    _processInputParams(input) {
        return {
            status: new parseUtil/* ParseStatus */.Q9(),
            ctx: {
                common: input.parent.common,
                data: input.data,
                parsedType: (0,util/* getParsedType */.FQ)(input.data),
                schemaErrorMap: this._def.errorMap,
                path: input.path,
                parent: input.parent,
            },
        };
    }
    _parseSync(input) {
        const result = this._parse(input);
        if ((0,parseUtil/* isAsync */.S9)(result)) {
            throw new Error("Synchronous parse encountered promise.");
        }
        return result;
    }
    _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
    }
    parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success)
            return result.data;
        throw result.error;
    }
    safeParse(data, params) {
        const ctx = {
            common: {
                issues: [],
                async: params?.async ?? false,
                contextualErrorMap: params?.errorMap,
            },
            path: params?.path || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: (0,util/* getParsedType */.FQ)(data),
        };
        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
        return handleResult(ctx, result);
    }
    "~validate"(data) {
        const ctx = {
            common: {
                issues: [],
                async: !!this["~standard"].async,
            },
            path: [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: (0,util/* getParsedType */.FQ)(data),
        };
        if (!this["~standard"].async) {
            try {
                const result = this._parseSync({ data, path: [], parent: ctx });
                return (0,parseUtil/* isValid */.JY)(result)
                    ? {
                        value: result.value,
                    }
                    : {
                        issues: ctx.common.issues,
                    };
            }
            catch (err) {
                if (err?.message?.toLowerCase()?.includes("encountered")) {
                    this["~standard"].async = true;
                }
                ctx.common = {
                    issues: [],
                    async: true,
                };
            }
        }
        return this._parseAsync({ data, path: [], parent: ctx }).then((result) => (0,parseUtil/* isValid */.JY)(result)
            ? {
                value: result.value,
            }
            : {
                issues: ctx.common.issues,
            });
    }
    async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success)
            return result.data;
        throw result.error;
    }
    async safeParseAsync(data, params) {
        const ctx = {
            common: {
                issues: [],
                contextualErrorMap: params?.errorMap,
                async: true,
            },
            path: params?.path || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: (0,util/* getParsedType */.FQ)(data),
        };
        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
        const result = await ((0,parseUtil/* isAsync */.S9)(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
        return handleResult(ctx, result);
    }
    refine(check, message) {
        const getIssueProperties = (val) => {
            if (typeof message === "string" || typeof message === "undefined") {
                return { message };
            }
            else if (typeof message === "function") {
                return message(val);
            }
            else {
                return message;
            }
        };
        return this._refinement((val, ctx) => {
            const result = check(val);
            const setError = () => ctx.addIssue({
                code: ZodError/* ZodIssueCode.custom */.NL.custom,
                ...getIssueProperties(val),
            });
            if (typeof Promise !== "undefined" && result instanceof Promise) {
                return result.then((data) => {
                    if (!data) {
                        setError();
                        return false;
                    }
                    else {
                        return true;
                    }
                });
            }
            if (!result) {
                setError();
                return false;
            }
            else {
                return true;
            }
        });
    }
    refinement(check, refinementData) {
        return this._refinement((val, ctx) => {
            if (!check(val)) {
                ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
                return false;
            }
            else {
                return true;
            }
        });
    }
    _refinement(refinement) {
        return new ZodEffects({
            schema: this,
            typeName: ZodFirstPartyTypeKind.ZodEffects,
            effect: { type: "refinement", refinement },
        });
    }
    superRefine(refinement) {
        return this._refinement(refinement);
    }
    constructor(def) {
        /** Alias of safeParseAsync */
        this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.readonly = this.readonly.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
        this["~standard"] = {
            version: 1,
            vendor: "zod",
            validate: (data) => this["~validate"](data),
        };
    }
    optional() {
        return ZodOptional.create(this, this._def);
    }
    nullable() {
        return ZodNullable.create(this, this._def);
    }
    nullish() {
        return this.nullable().optional();
    }
    array() {
        return ZodArray.create(this);
    }
    promise() {
        return ZodPromise.create(this, this._def);
    }
    or(option) {
        return ZodUnion.create([this, option], this._def);
    }
    and(incoming) {
        return ZodIntersection.create(this, incoming, this._def);
    }
    transform(transform) {
        return new ZodEffects({
            ...processCreateParams(this._def),
            schema: this,
            typeName: ZodFirstPartyTypeKind.ZodEffects,
            effect: { type: "transform", transform },
        });
    }
    default(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodDefault({
            ...processCreateParams(this._def),
            innerType: this,
            defaultValue: defaultValueFunc,
            typeName: ZodFirstPartyTypeKind.ZodDefault,
        });
    }
    brand() {
        return new ZodBranded({
            typeName: ZodFirstPartyTypeKind.ZodBranded,
            type: this,
            ...processCreateParams(this._def),
        });
    }
    catch(def) {
        const catchValueFunc = typeof def === "function" ? def : () => def;
        return new ZodCatch({
            ...processCreateParams(this._def),
            innerType: this,
            catchValue: catchValueFunc,
            typeName: ZodFirstPartyTypeKind.ZodCatch,
        });
    }
    describe(description) {
        const This = this.constructor;
        return new This({
            ...this._def,
            description,
        });
    }
    pipe(target) {
        return ZodPipeline.create(this, target);
    }
    readonly() {
        return ZodReadonly.create(this);
    }
    isOptional() {
        return this.safeParse(undefined).success;
    }
    isNullable() {
        return this.safeParse(null).success;
    }
}
const cuidRegex = /^c[^\s-]{8,}$/i;
const cuid2Regex = /^[0-9a-z]+$/;
const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
// const uuidRegex =
//   /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
const nanoidRegex = /^[a-z0-9_-]{21}$/i;
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
// from https://stackoverflow.com/a/46181/1550155
// old version: too slow, didn't support unicode
// const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
//old email regex
// const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((?!-)([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{1,})[^-<>()[\].,;:\s@"]$/i;
// eslint-disable-next-line
// const emailRegex =
//   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/;
// const emailRegex =
//   /^[a-zA-Z0-9\.\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// const emailRegex =
//   /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
// const emailRegex =
//   /^[a-z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9\-]+)*$/i;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
let emojiRegex;
// faster, simpler, safer
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
// const ipv6Regex =
// /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
const ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
// https://base64.guru/standards/base64url
const base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
// simple
// const dateRegexSource = `\\d{4}-\\d{2}-\\d{2}`;
// no leap year validation
// const dateRegexSource = `\\d{4}-((0[13578]|10|12)-31|(0[13-9]|1[0-2])-30|(0[1-9]|1[0-2])-(0[1-9]|1\\d|2\\d))`;
// with leap year validation
const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
    let secondsRegexSource = `[0-5]\\d`;
    if (args.precision) {
        secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
    }
    else if (args.precision == null) {
        secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
    }
    const secondsQuantifier = args.precision ? "+" : "?"; // require seconds if precision is nonzero
    return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
    return new RegExp(`^${timeRegexSource(args)}$`);
}
// Adapted from https://stackoverflow.com/a/3143231
function datetimeRegex(args) {
    let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
    const opts = [];
    opts.push(args.local ? `Z?` : `Z`);
    if (args.offset)
        opts.push(`([+-]\\d{2}:?\\d{2})`);
    regex = `${regex}(${opts.join("|")})`;
    return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
    if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
        return true;
    }
    if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
        return true;
    }
    return false;
}
function isValidJWT(jwt, alg) {
    if (!jwtRegex.test(jwt))
        return false;
    try {
        const [header] = jwt.split(".");
        if (!header)
            return false;
        // Convert base64url to base64
        const base64 = header
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(header.length + ((4 - (header.length % 4)) % 4), "=");
        const decoded = JSON.parse(atob(base64));
        if (typeof decoded !== "object" || decoded === null)
            return false;
        if ("typ" in decoded && decoded?.typ !== "JWT")
            return false;
        if (!decoded.alg)
            return false;
        if (alg && decoded.alg !== alg)
            return false;
        return true;
    }
    catch {
        return false;
    }
}
function isValidCidr(ip, version) {
    if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
        return true;
    }
    if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
        return true;
    }
    return false;
}
class ZodString extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = String(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util/* ZodParsedType.string */.$k.string) {
            const ctx = this._getOrReturnCtx(input);
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.string */.$k.string,
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        const status = new parseUtil/* ParseStatus */.Q9();
        let ctx = undefined;
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                if (input.data.length < check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.too_small */.NL.too_small,
                        minimum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                if (input.data.length > check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.too_big */.NL.too_big,
                        maximum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "length") {
                const tooBig = input.data.length > check.value;
                const tooSmall = input.data.length < check.value;
                if (tooBig || tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    if (tooBig) {
                        (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                            code: ZodError/* ZodIssueCode.too_big */.NL.too_big,
                            maximum: check.value,
                            type: "string",
                            inclusive: true,
                            exact: true,
                            message: check.message,
                        });
                    }
                    else if (tooSmall) {
                        (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                            code: ZodError/* ZodIssueCode.too_small */.NL.too_small,
                            minimum: check.value,
                            type: "string",
                            inclusive: true,
                            exact: true,
                            message: check.message,
                        });
                    }
                    status.dirty();
                }
            }
            else if (check.kind === "email") {
                if (!emailRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        validation: "email",
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "emoji") {
                if (!emojiRegex) {
                    emojiRegex = new RegExp(_emojiRegex, "u");
                }
                if (!emojiRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        validation: "emoji",
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "uuid") {
                if (!uuidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        validation: "uuid",
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "nanoid") {
                if (!nanoidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        validation: "nanoid",
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "cuid") {
                if (!cuidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        validation: "cuid",
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "cuid2") {
                if (!cuid2Regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        validation: "cuid2",
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "ulid") {
                if (!ulidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        validation: "ulid",
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "url") {
                try {
                    new URL(input.data);
                }
                catch {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        validation: "url",
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "regex") {
                check.regex.lastIndex = 0;
                const testResult = check.regex.test(input.data);
                if (!testResult) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        validation: "regex",
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "trim") {
                input.data = input.data.trim();
            }
            else if (check.kind === "includes") {
                if (!input.data.includes(check.value, check.position)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        validation: { includes: check.value, position: check.position },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "toLowerCase") {
                input.data = input.data.toLowerCase();
            }
            else if (check.kind === "toUpperCase") {
                input.data = input.data.toUpperCase();
            }
            else if (check.kind === "startsWith") {
                if (!input.data.startsWith(check.value)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        validation: { startsWith: check.value },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "endsWith") {
                if (!input.data.endsWith(check.value)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        validation: { endsWith: check.value },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "datetime") {
                const regex = datetimeRegex(check);
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        validation: "datetime",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "date") {
                const regex = dateRegex;
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        validation: "date",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "time") {
                const regex = timeRegex(check);
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        validation: "time",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "duration") {
                if (!durationRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        validation: "duration",
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "ip") {
                if (!isValidIP(input.data, check.version)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        validation: "ip",
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "jwt") {
                if (!isValidJWT(input.data, check.alg)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        validation: "jwt",
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "cidr") {
                if (!isValidCidr(input.data, check.version)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        validation: "cidr",
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "base64") {
                if (!base64Regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        validation: "base64",
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "base64url") {
                if (!base64urlRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        validation: "base64url",
                        code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util/* util.assertNever */.D5.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    _regex(regex, validation, message) {
        return this.refinement((data) => regex.test(data), {
            validation,
            code: ZodError/* ZodIssueCode.invalid_string */.NL.invalid_string,
            ...errorUtil.errToObj(message),
        });
    }
    _addCheck(check) {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    email(message) {
        return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
    }
    url(message) {
        return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
    }
    emoji(message) {
        return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
    }
    uuid(message) {
        return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
    }
    nanoid(message) {
        return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
    }
    cuid(message) {
        return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
    }
    cuid2(message) {
        return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
    }
    ulid(message) {
        return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
    }
    base64(message) {
        return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
    }
    base64url(message) {
        // base64url encoding is a modification of base64 that can safely be used in URLs and filenames
        return this._addCheck({
            kind: "base64url",
            ...errorUtil.errToObj(message),
        });
    }
    jwt(options) {
        return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
    }
    ip(options) {
        return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
    }
    cidr(options) {
        return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
    }
    datetime(options) {
        if (typeof options === "string") {
            return this._addCheck({
                kind: "datetime",
                precision: null,
                offset: false,
                local: false,
                message: options,
            });
        }
        return this._addCheck({
            kind: "datetime",
            precision: typeof options?.precision === "undefined" ? null : options?.precision,
            offset: options?.offset ?? false,
            local: options?.local ?? false,
            ...errorUtil.errToObj(options?.message),
        });
    }
    date(message) {
        return this._addCheck({ kind: "date", message });
    }
    time(options) {
        if (typeof options === "string") {
            return this._addCheck({
                kind: "time",
                precision: null,
                message: options,
            });
        }
        return this._addCheck({
            kind: "time",
            precision: typeof options?.precision === "undefined" ? null : options?.precision,
            ...errorUtil.errToObj(options?.message),
        });
    }
    duration(message) {
        return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
    }
    regex(regex, message) {
        return this._addCheck({
            kind: "regex",
            regex: regex,
            ...errorUtil.errToObj(message),
        });
    }
    includes(value, options) {
        return this._addCheck({
            kind: "includes",
            value: value,
            position: options?.position,
            ...errorUtil.errToObj(options?.message),
        });
    }
    startsWith(value, message) {
        return this._addCheck({
            kind: "startsWith",
            value: value,
            ...errorUtil.errToObj(message),
        });
    }
    endsWith(value, message) {
        return this._addCheck({
            kind: "endsWith",
            value: value,
            ...errorUtil.errToObj(message),
        });
    }
    min(minLength, message) {
        return this._addCheck({
            kind: "min",
            value: minLength,
            ...errorUtil.errToObj(message),
        });
    }
    max(maxLength, message) {
        return this._addCheck({
            kind: "max",
            value: maxLength,
            ...errorUtil.errToObj(message),
        });
    }
    length(len, message) {
        return this._addCheck({
            kind: "length",
            value: len,
            ...errorUtil.errToObj(message),
        });
    }
    /**
     * Equivalent to `.min(1)`
     */
    nonempty(message) {
        return this.min(1, errorUtil.errToObj(message));
    }
    trim() {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "trim" }],
        });
    }
    toLowerCase() {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "toLowerCase" }],
        });
    }
    toUpperCase() {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "toUpperCase" }],
        });
    }
    get isDatetime() {
        return !!this._def.checks.find((ch) => ch.kind === "datetime");
    }
    get isDate() {
        return !!this._def.checks.find((ch) => ch.kind === "date");
    }
    get isTime() {
        return !!this._def.checks.find((ch) => ch.kind === "time");
    }
    get isDuration() {
        return !!this._def.checks.find((ch) => ch.kind === "duration");
    }
    get isEmail() {
        return !!this._def.checks.find((ch) => ch.kind === "email");
    }
    get isURL() {
        return !!this._def.checks.find((ch) => ch.kind === "url");
    }
    get isEmoji() {
        return !!this._def.checks.find((ch) => ch.kind === "emoji");
    }
    get isUUID() {
        return !!this._def.checks.find((ch) => ch.kind === "uuid");
    }
    get isNANOID() {
        return !!this._def.checks.find((ch) => ch.kind === "nanoid");
    }
    get isCUID() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid");
    }
    get isCUID2() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
    }
    get isULID() {
        return !!this._def.checks.find((ch) => ch.kind === "ulid");
    }
    get isIP() {
        return !!this._def.checks.find((ch) => ch.kind === "ip");
    }
    get isCIDR() {
        return !!this._def.checks.find((ch) => ch.kind === "cidr");
    }
    get isBase64() {
        return !!this._def.checks.find((ch) => ch.kind === "base64");
    }
    get isBase64url() {
        // base64url encoding is a modification of base64 that can safely be used in URLs and filenames
        return !!this._def.checks.find((ch) => ch.kind === "base64url");
    }
    get minLength() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxLength() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
}
ZodString.create = (params) => {
    return new ZodString({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodString,
        coerce: params?.coerce ?? false,
        ...processCreateParams(params),
    });
};
// https://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript/31711034#31711034
function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
    return (valInt % stepInt) / 10 ** decCount;
}
class ZodNumber extends ZodType {
    constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
    }
    _parse(input) {
        if (this._def.coerce) {
            input.data = Number(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util/* ZodParsedType.number */.$k.number) {
            const ctx = this._getOrReturnCtx(input);
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.number */.$k.number,
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        let ctx = undefined;
        const status = new parseUtil/* ParseStatus */.Q9();
        for (const check of this._def.checks) {
            if (check.kind === "int") {
                if (!util/* util.isInteger */.D5.isInteger(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                        expected: "integer",
                        received: "float",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "min") {
                const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
                if (tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.too_small */.NL.too_small,
                        minimum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
                if (tooBig) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.too_big */.NL.too_big,
                        maximum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "multipleOf") {
                if (floatSafeRemainder(input.data, check.value) !== 0) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.not_multiple_of */.NL.not_multiple_of,
                        multipleOf: check.value,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "finite") {
                if (!Number.isFinite(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.not_finite */.NL.not_finite,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util/* util.assertNever */.D5.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
        return new ZodNumber({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind,
                    value,
                    inclusive,
                    message: errorUtil.toString(message),
                },
            ],
        });
    }
    _addCheck(check) {
        return new ZodNumber({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    int(message) {
        return this._addCheck({
            kind: "int",
            message: errorUtil.toString(message),
        });
    }
    positive(message) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    negative(message) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    nonpositive(message) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    nonnegative(message) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    multipleOf(value, message) {
        return this._addCheck({
            kind: "multipleOf",
            value: value,
            message: errorUtil.toString(message),
        });
    }
    finite(message) {
        return this._addCheck({
            kind: "finite",
            message: errorUtil.toString(message),
        });
    }
    safe(message) {
        return this._addCheck({
            kind: "min",
            inclusive: true,
            value: Number.MIN_SAFE_INTEGER,
            message: errorUtil.toString(message),
        })._addCheck({
            kind: "max",
            inclusive: true,
            value: Number.MAX_SAFE_INTEGER,
            message: errorUtil.toString(message),
        });
    }
    get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
    get isInt() {
        return !!this._def.checks.find((ch) => ch.kind === "int" || (ch.kind === "multipleOf" && util/* util.isInteger */.D5.isInteger(ch.value)));
    }
    get isFinite() {
        let max = null;
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
                return true;
            }
            else if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
            else if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return Number.isFinite(min) && Number.isFinite(max);
    }
}
ZodNumber.create = (params) => {
    return new ZodNumber({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodNumber,
        coerce: params?.coerce || false,
        ...processCreateParams(params),
    });
};
class ZodBigInt extends ZodType {
    constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
    }
    _parse(input) {
        if (this._def.coerce) {
            try {
                input.data = BigInt(input.data);
            }
            catch {
                return this._getInvalidInput(input);
            }
        }
        const parsedType = this._getType(input);
        if (parsedType !== util/* ZodParsedType.bigint */.$k.bigint) {
            return this._getInvalidInput(input);
        }
        let ctx = undefined;
        const status = new parseUtil/* ParseStatus */.Q9();
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
                if (tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.too_small */.NL.too_small,
                        type: "bigint",
                        minimum: check.value,
                        inclusive: check.inclusive,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
                if (tooBig) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.too_big */.NL.too_big,
                        type: "bigint",
                        maximum: check.value,
                        inclusive: check.inclusive,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "multipleOf") {
                if (input.data % check.value !== BigInt(0)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.not_multiple_of */.NL.not_multiple_of,
                        multipleOf: check.value,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util/* util.assertNever */.D5.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    _getInvalidInput(input) {
        const ctx = this._getOrReturnCtx(input);
        (0,parseUtil/* addIssueToContext */.KD)(ctx, {
            code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
            expected: util/* ZodParsedType.bigint */.$k.bigint,
            received: ctx.parsedType,
        });
        return parseUtil/* INVALID */.UI;
    }
    gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
        return new ZodBigInt({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind,
                    value,
                    inclusive,
                    message: errorUtil.toString(message),
                },
            ],
        });
    }
    _addCheck(check) {
        return new ZodBigInt({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    positive(message) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    negative(message) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    nonpositive(message) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    nonnegative(message) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    multipleOf(value, message) {
        return this._addCheck({
            kind: "multipleOf",
            value,
            message: errorUtil.toString(message),
        });
    }
    get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
}
ZodBigInt.create = (params) => {
    return new ZodBigInt({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodBigInt,
        coerce: params?.coerce ?? false,
        ...processCreateParams(params),
    });
};
class ZodBoolean extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = Boolean(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util/* ZodParsedType.boolean */.$k.boolean) {
            const ctx = this._getOrReturnCtx(input);
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.boolean */.$k.boolean,
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        return (0,parseUtil.OK)(input.data);
    }
}
ZodBoolean.create = (params) => {
    return new ZodBoolean({
        typeName: ZodFirstPartyTypeKind.ZodBoolean,
        coerce: params?.coerce || false,
        ...processCreateParams(params),
    });
};
class ZodDate extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = new Date(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util/* ZodParsedType.date */.$k.date) {
            const ctx = this._getOrReturnCtx(input);
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.date */.$k.date,
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        if (Number.isNaN(input.data.getTime())) {
            const ctx = this._getOrReturnCtx(input);
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_date */.NL.invalid_date,
            });
            return parseUtil/* INVALID */.UI;
        }
        const status = new parseUtil/* ParseStatus */.Q9();
        let ctx = undefined;
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                if (input.data.getTime() < check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.too_small */.NL.too_small,
                        message: check.message,
                        inclusive: true,
                        exact: false,
                        minimum: check.value,
                        type: "date",
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                if (input.data.getTime() > check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.too_big */.NL.too_big,
                        message: check.message,
                        inclusive: true,
                        exact: false,
                        maximum: check.value,
                        type: "date",
                    });
                    status.dirty();
                }
            }
            else {
                util/* util.assertNever */.D5.assertNever(check);
            }
        }
        return {
            status: status.value,
            value: new Date(input.data.getTime()),
        };
    }
    _addCheck(check) {
        return new ZodDate({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    min(minDate, message) {
        return this._addCheck({
            kind: "min",
            value: minDate.getTime(),
            message: errorUtil.toString(message),
        });
    }
    max(maxDate, message) {
        return this._addCheck({
            kind: "max",
            value: maxDate.getTime(),
            message: errorUtil.toString(message),
        });
    }
    get minDate() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min != null ? new Date(min) : null;
    }
    get maxDate() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max != null ? new Date(max) : null;
    }
}
ZodDate.create = (params) => {
    return new ZodDate({
        checks: [],
        coerce: params?.coerce || false,
        typeName: ZodFirstPartyTypeKind.ZodDate,
        ...processCreateParams(params),
    });
};
class ZodSymbol extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util/* ZodParsedType.symbol */.$k.symbol) {
            const ctx = this._getOrReturnCtx(input);
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.symbol */.$k.symbol,
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        return (0,parseUtil.OK)(input.data);
    }
}
ZodSymbol.create = (params) => {
    return new ZodSymbol({
        typeName: ZodFirstPartyTypeKind.ZodSymbol,
        ...processCreateParams(params),
    });
};
class ZodUndefined extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util/* ZodParsedType.undefined */.$k.undefined) {
            const ctx = this._getOrReturnCtx(input);
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.undefined */.$k.undefined,
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        return (0,parseUtil.OK)(input.data);
    }
}
ZodUndefined.create = (params) => {
    return new ZodUndefined({
        typeName: ZodFirstPartyTypeKind.ZodUndefined,
        ...processCreateParams(params),
    });
};
class ZodNull extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util/* ZodParsedType.null */.$k["null"]) {
            const ctx = this._getOrReturnCtx(input);
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.null */.$k["null"],
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        return (0,parseUtil.OK)(input.data);
    }
}
ZodNull.create = (params) => {
    return new ZodNull({
        typeName: ZodFirstPartyTypeKind.ZodNull,
        ...processCreateParams(params),
    });
};
class ZodAny extends ZodType {
    constructor() {
        super(...arguments);
        // to prevent instances of other classes from extending ZodAny. this causes issues with catchall in ZodObject.
        this._any = true;
    }
    _parse(input) {
        return (0,parseUtil.OK)(input.data);
    }
}
ZodAny.create = (params) => {
    return new ZodAny({
        typeName: ZodFirstPartyTypeKind.ZodAny,
        ...processCreateParams(params),
    });
};
class ZodUnknown extends ZodType {
    constructor() {
        super(...arguments);
        // required
        this._unknown = true;
    }
    _parse(input) {
        return (0,parseUtil.OK)(input.data);
    }
}
ZodUnknown.create = (params) => {
    return new ZodUnknown({
        typeName: ZodFirstPartyTypeKind.ZodUnknown,
        ...processCreateParams(params),
    });
};
class ZodNever extends ZodType {
    _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        (0,parseUtil/* addIssueToContext */.KD)(ctx, {
            code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
            expected: util/* ZodParsedType.never */.$k.never,
            received: ctx.parsedType,
        });
        return parseUtil/* INVALID */.UI;
    }
}
ZodNever.create = (params) => {
    return new ZodNever({
        typeName: ZodFirstPartyTypeKind.ZodNever,
        ...processCreateParams(params),
    });
};
class ZodVoid extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util/* ZodParsedType.undefined */.$k.undefined) {
            const ctx = this._getOrReturnCtx(input);
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.void */.$k["void"],
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        return (0,parseUtil.OK)(input.data);
    }
}
ZodVoid.create = (params) => {
    return new ZodVoid({
        typeName: ZodFirstPartyTypeKind.ZodVoid,
        ...processCreateParams(params),
    });
};
class ZodArray extends ZodType {
    _parse(input) {
        const { ctx, status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== util/* ZodParsedType.array */.$k.array) {
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.array */.$k.array,
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        if (def.exactLength !== null) {
            const tooBig = ctx.data.length > def.exactLength.value;
            const tooSmall = ctx.data.length < def.exactLength.value;
            if (tooBig || tooSmall) {
                (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                    code: tooBig ? ZodError/* ZodIssueCode.too_big */.NL.too_big : ZodError/* ZodIssueCode.too_small */.NL.too_small,
                    minimum: (tooSmall ? def.exactLength.value : undefined),
                    maximum: (tooBig ? def.exactLength.value : undefined),
                    type: "array",
                    inclusive: true,
                    exact: true,
                    message: def.exactLength.message,
                });
                status.dirty();
            }
        }
        if (def.minLength !== null) {
            if (ctx.data.length < def.minLength.value) {
                (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                    code: ZodError/* ZodIssueCode.too_small */.NL.too_small,
                    minimum: def.minLength.value,
                    type: "array",
                    inclusive: true,
                    exact: false,
                    message: def.minLength.message,
                });
                status.dirty();
            }
        }
        if (def.maxLength !== null) {
            if (ctx.data.length > def.maxLength.value) {
                (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                    code: ZodError/* ZodIssueCode.too_big */.NL.too_big,
                    maximum: def.maxLength.value,
                    type: "array",
                    inclusive: true,
                    exact: false,
                    message: def.maxLength.message,
                });
                status.dirty();
            }
        }
        if (ctx.common.async) {
            return Promise.all([...ctx.data].map((item, i) => {
                return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
            })).then((result) => {
                return parseUtil/* ParseStatus.mergeArray */.Q9.mergeArray(status, result);
            });
        }
        const result = [...ctx.data].map((item, i) => {
            return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        });
        return parseUtil/* ParseStatus.mergeArray */.Q9.mergeArray(status, result);
    }
    get element() {
        return this._def.type;
    }
    min(minLength, message) {
        return new ZodArray({
            ...this._def,
            minLength: { value: minLength, message: errorUtil.toString(message) },
        });
    }
    max(maxLength, message) {
        return new ZodArray({
            ...this._def,
            maxLength: { value: maxLength, message: errorUtil.toString(message) },
        });
    }
    length(len, message) {
        return new ZodArray({
            ...this._def,
            exactLength: { value: len, message: errorUtil.toString(message) },
        });
    }
    nonempty(message) {
        return this.min(1, message);
    }
}
ZodArray.create = (schema, params) => {
    return new ZodArray({
        type: schema,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: ZodFirstPartyTypeKind.ZodArray,
        ...processCreateParams(params),
    });
};
function deepPartialify(schema) {
    if (schema instanceof ZodObject) {
        const newShape = {};
        for (const key in schema.shape) {
            const fieldSchema = schema.shape[key];
            newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
        }
        return new ZodObject({
            ...schema._def,
            shape: () => newShape,
        });
    }
    else if (schema instanceof ZodArray) {
        return new ZodArray({
            ...schema._def,
            type: deepPartialify(schema.element),
        });
    }
    else if (schema instanceof ZodOptional) {
        return ZodOptional.create(deepPartialify(schema.unwrap()));
    }
    else if (schema instanceof ZodNullable) {
        return ZodNullable.create(deepPartialify(schema.unwrap()));
    }
    else if (schema instanceof ZodTuple) {
        return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
    }
    else {
        return schema;
    }
}
class ZodObject extends ZodType {
    constructor() {
        super(...arguments);
        this._cached = null;
        /**
         * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
         * If you want to pass through unknown properties, use `.passthrough()` instead.
         */
        this.nonstrict = this.passthrough;
        // extend<
        //   Augmentation extends ZodRawShape,
        //   NewOutput extends util.flatten<{
        //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
        //       ? Augmentation[k]["_output"]
        //       : k extends keyof Output
        //       ? Output[k]
        //       : never;
        //   }>,
        //   NewInput extends util.flatten<{
        //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
        //       ? Augmentation[k]["_input"]
        //       : k extends keyof Input
        //       ? Input[k]
        //       : never;
        //   }>
        // >(
        //   augmentation: Augmentation
        // ): ZodObject<
        //   extendShape<T, Augmentation>,
        //   UnknownKeys,
        //   Catchall,
        //   NewOutput,
        //   NewInput
        // > {
        //   return new ZodObject({
        //     ...this._def,
        //     shape: () => ({
        //       ...this._def.shape(),
        //       ...augmentation,
        //     }),
        //   }) as any;
        // }
        /**
         * @deprecated Use `.extend` instead
         *  */
        this.augment = this.extend;
    }
    _getCached() {
        if (this._cached !== null)
            return this._cached;
        const shape = this._def.shape();
        const keys = util/* util.objectKeys */.D5.objectKeys(shape);
        this._cached = { shape, keys };
        return this._cached;
    }
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util/* ZodParsedType.object */.$k.object) {
            const ctx = this._getOrReturnCtx(input);
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.object */.$k.object,
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        const { status, ctx } = this._processInputParams(input);
        const { shape, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
            for (const key in ctx.data) {
                if (!shapeKeys.includes(key)) {
                    extraKeys.push(key);
                }
            }
        }
        const pairs = [];
        for (const key of shapeKeys) {
            const keyValidator = shape[key];
            const value = ctx.data[key];
            pairs.push({
                key: { status: "valid", value: key },
                value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
                alwaysSet: key in ctx.data,
            });
        }
        if (this._def.catchall instanceof ZodNever) {
            const unknownKeys = this._def.unknownKeys;
            if (unknownKeys === "passthrough") {
                for (const key of extraKeys) {
                    pairs.push({
                        key: { status: "valid", value: key },
                        value: { status: "valid", value: ctx.data[key] },
                    });
                }
            }
            else if (unknownKeys === "strict") {
                if (extraKeys.length > 0) {
                    (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                        code: ZodError/* ZodIssueCode.unrecognized_keys */.NL.unrecognized_keys,
                        keys: extraKeys,
                    });
                    status.dirty();
                }
            }
            else if (unknownKeys === "strip") {
            }
            else {
                throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
            }
        }
        else {
            // run catchall validation
            const catchall = this._def.catchall;
            for (const key of extraKeys) {
                const value = ctx.data[key];
                pairs.push({
                    key: { status: "valid", value: key },
                    value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key) //, ctx.child(key), value, getParsedType(value)
                    ),
                    alwaysSet: key in ctx.data,
                });
            }
        }
        if (ctx.common.async) {
            return Promise.resolve()
                .then(async () => {
                const syncPairs = [];
                for (const pair of pairs) {
                    const key = await pair.key;
                    const value = await pair.value;
                    syncPairs.push({
                        key,
                        value,
                        alwaysSet: pair.alwaysSet,
                    });
                }
                return syncPairs;
            })
                .then((syncPairs) => {
                return parseUtil/* ParseStatus.mergeObjectSync */.Q9.mergeObjectSync(status, syncPairs);
            });
        }
        else {
            return parseUtil/* ParseStatus.mergeObjectSync */.Q9.mergeObjectSync(status, pairs);
        }
    }
    get shape() {
        return this._def.shape();
    }
    strict(message) {
        errorUtil.errToObj;
        return new ZodObject({
            ...this._def,
            unknownKeys: "strict",
            ...(message !== undefined
                ? {
                    errorMap: (issue, ctx) => {
                        const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
                        if (issue.code === "unrecognized_keys")
                            return {
                                message: errorUtil.errToObj(message).message ?? defaultError,
                            };
                        return {
                            message: defaultError,
                        };
                    },
                }
                : {}),
        });
    }
    strip() {
        return new ZodObject({
            ...this._def,
            unknownKeys: "strip",
        });
    }
    passthrough() {
        return new ZodObject({
            ...this._def,
            unknownKeys: "passthrough",
        });
    }
    // const AugmentFactory =
    //   <Def extends ZodObjectDef>(def: Def) =>
    //   <Augmentation extends ZodRawShape>(
    //     augmentation: Augmentation
    //   ): ZodObject<
    //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
    //     Def["unknownKeys"],
    //     Def["catchall"]
    //   > => {
    //     return new ZodObject({
    //       ...def,
    //       shape: () => ({
    //         ...def.shape(),
    //         ...augmentation,
    //       }),
    //     }) as any;
    //   };
    extend(augmentation) {
        return new ZodObject({
            ...this._def,
            shape: () => ({
                ...this._def.shape(),
                ...augmentation,
            }),
        });
    }
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */
    merge(merging) {
        const merged = new ZodObject({
            unknownKeys: merging._def.unknownKeys,
            catchall: merging._def.catchall,
            shape: () => ({
                ...this._def.shape(),
                ...merging._def.shape(),
            }),
            typeName: ZodFirstPartyTypeKind.ZodObject,
        });
        return merged;
    }
    // merge<
    //   Incoming extends AnyZodObject,
    //   Augmentation extends Incoming["shape"],
    //   NewOutput extends {
    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
    //       ? Augmentation[k]["_output"]
    //       : k extends keyof Output
    //       ? Output[k]
    //       : never;
    //   },
    //   NewInput extends {
    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
    //       ? Augmentation[k]["_input"]
    //       : k extends keyof Input
    //       ? Input[k]
    //       : never;
    //   }
    // >(
    //   merging: Incoming
    // ): ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"],
    //   NewOutput,
    //   NewInput
    // > {
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    setKey(key, schema) {
        return this.augment({ [key]: schema });
    }
    // merge<Incoming extends AnyZodObject>(
    //   merging: Incoming
    // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
    // ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"]
    // > {
    //   // const mergedShape = objectUtil.mergeShapes(
    //   //   this._def.shape(),
    //   //   merging._def.shape()
    //   // );
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    catchall(index) {
        return new ZodObject({
            ...this._def,
            catchall: index,
        });
    }
    pick(mask) {
        const shape = {};
        for (const key of util/* util.objectKeys */.D5.objectKeys(mask)) {
            if (mask[key] && this.shape[key]) {
                shape[key] = this.shape[key];
            }
        }
        return new ZodObject({
            ...this._def,
            shape: () => shape,
        });
    }
    omit(mask) {
        const shape = {};
        for (const key of util/* util.objectKeys */.D5.objectKeys(this.shape)) {
            if (!mask[key]) {
                shape[key] = this.shape[key];
            }
        }
        return new ZodObject({
            ...this._def,
            shape: () => shape,
        });
    }
    /**
     * @deprecated
     */
    deepPartial() {
        return deepPartialify(this);
    }
    partial(mask) {
        const newShape = {};
        for (const key of util/* util.objectKeys */.D5.objectKeys(this.shape)) {
            const fieldSchema = this.shape[key];
            if (mask && !mask[key]) {
                newShape[key] = fieldSchema;
            }
            else {
                newShape[key] = fieldSchema.optional();
            }
        }
        return new ZodObject({
            ...this._def,
            shape: () => newShape,
        });
    }
    required(mask) {
        const newShape = {};
        for (const key of util/* util.objectKeys */.D5.objectKeys(this.shape)) {
            if (mask && !mask[key]) {
                newShape[key] = this.shape[key];
            }
            else {
                const fieldSchema = this.shape[key];
                let newField = fieldSchema;
                while (newField instanceof ZodOptional) {
                    newField = newField._def.innerType;
                }
                newShape[key] = newField;
            }
        }
        return new ZodObject({
            ...this._def,
            shape: () => newShape,
        });
    }
    keyof() {
        return createZodEnum(util/* util.objectKeys */.D5.objectKeys(this.shape));
    }
}
ZodObject.create = (shape, params) => {
    return new ZodObject({
        shape: () => shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
ZodObject.strictCreate = (shape, params) => {
    return new ZodObject({
        shape: () => shape,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
ZodObject.lazycreate = (shape, params) => {
    return new ZodObject({
        shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
class ZodUnion extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const options = this._def.options;
        function handleResults(results) {
            // return first issue-free validation if it exists
            for (const result of results) {
                if (result.result.status === "valid") {
                    return result.result;
                }
            }
            for (const result of results) {
                if (result.result.status === "dirty") {
                    // add issues from dirty option
                    ctx.common.issues.push(...result.ctx.common.issues);
                    return result.result;
                }
            }
            // return invalid
            const unionErrors = results.map((result) => new ZodError/* ZodError */.jm(result.ctx.common.issues));
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_union */.NL.invalid_union,
                unionErrors,
            });
            return parseUtil/* INVALID */.UI;
        }
        if (ctx.common.async) {
            return Promise.all(options.map(async (option) => {
                const childCtx = {
                    ...ctx,
                    common: {
                        ...ctx.common,
                        issues: [],
                    },
                    parent: null,
                };
                return {
                    result: await option._parseAsync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: childCtx,
                    }),
                    ctx: childCtx,
                };
            })).then(handleResults);
        }
        else {
            let dirty = undefined;
            const issues = [];
            for (const option of options) {
                const childCtx = {
                    ...ctx,
                    common: {
                        ...ctx.common,
                        issues: [],
                    },
                    parent: null,
                };
                const result = option._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: childCtx,
                });
                if (result.status === "valid") {
                    return result;
                }
                else if (result.status === "dirty" && !dirty) {
                    dirty = { result, ctx: childCtx };
                }
                if (childCtx.common.issues.length) {
                    issues.push(childCtx.common.issues);
                }
            }
            if (dirty) {
                ctx.common.issues.push(...dirty.ctx.common.issues);
                return dirty.result;
            }
            const unionErrors = issues.map((issues) => new ZodError/* ZodError */.jm(issues));
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_union */.NL.invalid_union,
                unionErrors,
            });
            return parseUtil/* INVALID */.UI;
        }
    }
    get options() {
        return this._def.options;
    }
}
ZodUnion.create = (types, params) => {
    return new ZodUnion({
        options: types,
        typeName: ZodFirstPartyTypeKind.ZodUnion,
        ...processCreateParams(params),
    });
};
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
//////////                                 //////////
//////////      ZodDiscriminatedUnion      //////////
//////////                                 //////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
const getDiscriminator = (type) => {
    if (type instanceof ZodLazy) {
        return getDiscriminator(type.schema);
    }
    else if (type instanceof ZodEffects) {
        return getDiscriminator(type.innerType());
    }
    else if (type instanceof ZodLiteral) {
        return [type.value];
    }
    else if (type instanceof ZodEnum) {
        return type.options;
    }
    else if (type instanceof ZodNativeEnum) {
        // eslint-disable-next-line ban/ban
        return util/* util.objectValues */.D5.objectValues(type.enum);
    }
    else if (type instanceof ZodDefault) {
        return getDiscriminator(type._def.innerType);
    }
    else if (type instanceof ZodUndefined) {
        return [undefined];
    }
    else if (type instanceof ZodNull) {
        return [null];
    }
    else if (type instanceof ZodOptional) {
        return [undefined, ...getDiscriminator(type.unwrap())];
    }
    else if (type instanceof ZodNullable) {
        return [null, ...getDiscriminator(type.unwrap())];
    }
    else if (type instanceof ZodBranded) {
        return getDiscriminator(type.unwrap());
    }
    else if (type instanceof ZodReadonly) {
        return getDiscriminator(type.unwrap());
    }
    else if (type instanceof ZodCatch) {
        return getDiscriminator(type._def.innerType);
    }
    else {
        return [];
    }
};
class ZodDiscriminatedUnion extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util/* ZodParsedType.object */.$k.object) {
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.object */.$k.object,
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        const discriminator = this.discriminator;
        const discriminatorValue = ctx.data[discriminator];
        const option = this.optionsMap.get(discriminatorValue);
        if (!option) {
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_union_discriminator */.NL.invalid_union_discriminator,
                options: Array.from(this.optionsMap.keys()),
                path: [discriminator],
            });
            return parseUtil/* INVALID */.UI;
        }
        if (ctx.common.async) {
            return option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
        }
        else {
            return option._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
        }
    }
    get discriminator() {
        return this._def.discriminator;
    }
    get options() {
        return this._def.options;
    }
    get optionsMap() {
        return this._def.optionsMap;
    }
    /**
     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
     * have a different value for each object in the union.
     * @param discriminator the name of the discriminator property
     * @param types an array of object schemas
     * @param params
     */
    static create(discriminator, options, params) {
        // Get all the valid discriminator values
        const optionsMap = new Map();
        // try {
        for (const type of options) {
            const discriminatorValues = getDiscriminator(type.shape[discriminator]);
            if (!discriminatorValues.length) {
                throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
            }
            for (const value of discriminatorValues) {
                if (optionsMap.has(value)) {
                    throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
                }
                optionsMap.set(value, type);
            }
        }
        return new ZodDiscriminatedUnion({
            typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
            discriminator,
            options,
            optionsMap,
            ...processCreateParams(params),
        });
    }
}
function mergeValues(a, b) {
    const aType = (0,util/* getParsedType */.FQ)(a);
    const bType = (0,util/* getParsedType */.FQ)(b);
    if (a === b) {
        return { valid: true, data: a };
    }
    else if (aType === util/* ZodParsedType.object */.$k.object && bType === util/* ZodParsedType.object */.$k.object) {
        const bKeys = util/* util.objectKeys */.D5.objectKeys(b);
        const sharedKeys = util/* util.objectKeys */.D5.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
        const newObj = { ...a, ...b };
        for (const key of sharedKeys) {
            const sharedValue = mergeValues(a[key], b[key]);
            if (!sharedValue.valid) {
                return { valid: false };
            }
            newObj[key] = sharedValue.data;
        }
        return { valid: true, data: newObj };
    }
    else if (aType === util/* ZodParsedType.array */.$k.array && bType === util/* ZodParsedType.array */.$k.array) {
        if (a.length !== b.length) {
            return { valid: false };
        }
        const newArray = [];
        for (let index = 0; index < a.length; index++) {
            const itemA = a[index];
            const itemB = b[index];
            const sharedValue = mergeValues(itemA, itemB);
            if (!sharedValue.valid) {
                return { valid: false };
            }
            newArray.push(sharedValue.data);
        }
        return { valid: true, data: newArray };
    }
    else if (aType === util/* ZodParsedType.date */.$k.date && bType === util/* ZodParsedType.date */.$k.date && +a === +b) {
        return { valid: true, data: a };
    }
    else {
        return { valid: false };
    }
}
class ZodIntersection extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const handleParsed = (parsedLeft, parsedRight) => {
            if ((0,parseUtil/* isAborted */.Hc)(parsedLeft) || (0,parseUtil/* isAborted */.Hc)(parsedRight)) {
                return parseUtil/* INVALID */.UI;
            }
            const merged = mergeValues(parsedLeft.value, parsedRight.value);
            if (!merged.valid) {
                (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                    code: ZodError/* ZodIssueCode.invalid_intersection_types */.NL.invalid_intersection_types,
                });
                return parseUtil/* INVALID */.UI;
            }
            if ((0,parseUtil/* isDirty */.eT)(parsedLeft) || (0,parseUtil/* isDirty */.eT)(parsedRight)) {
                status.dirty();
            }
            return { status: status.value, value: merged.data };
        };
        if (ctx.common.async) {
            return Promise.all([
                this._def.left._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                }),
                this._def.right._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                }),
            ]).then(([left, right]) => handleParsed(left, right));
        }
        else {
            return handleParsed(this._def.left._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            }), this._def.right._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            }));
        }
    }
}
ZodIntersection.create = (left, right, params) => {
    return new ZodIntersection({
        left: left,
        right: right,
        typeName: ZodFirstPartyTypeKind.ZodIntersection,
        ...processCreateParams(params),
    });
};
// type ZodTupleItems = [ZodTypeAny, ...ZodTypeAny[]];
class ZodTuple extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util/* ZodParsedType.array */.$k.array) {
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.array */.$k.array,
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        if (ctx.data.length < this._def.items.length) {
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.too_small */.NL.too_small,
                minimum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array",
            });
            return parseUtil/* INVALID */.UI;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.too_big */.NL.too_big,
                maximum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array",
            });
            status.dirty();
        }
        const items = [...ctx.data]
            .map((item, itemIndex) => {
            const schema = this._def.items[itemIndex] || this._def.rest;
            if (!schema)
                return null;
            return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        })
            .filter((x) => !!x); // filter nulls
        if (ctx.common.async) {
            return Promise.all(items).then((results) => {
                return parseUtil/* ParseStatus.mergeArray */.Q9.mergeArray(status, results);
            });
        }
        else {
            return parseUtil/* ParseStatus.mergeArray */.Q9.mergeArray(status, items);
        }
    }
    get items() {
        return this._def.items;
    }
    rest(rest) {
        return new ZodTuple({
            ...this._def,
            rest,
        });
    }
}
ZodTuple.create = (schemas, params) => {
    if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    }
    return new ZodTuple({
        items: schemas,
        typeName: ZodFirstPartyTypeKind.ZodTuple,
        rest: null,
        ...processCreateParams(params),
    });
};
class ZodRecord extends ZodType {
    get keySchema() {
        return this._def.keyType;
    }
    get valueSchema() {
        return this._def.valueType;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util/* ZodParsedType.object */.$k.object) {
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.object */.$k.object,
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        const pairs = [];
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        for (const key in ctx.data) {
            pairs.push({
                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
                value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
                alwaysSet: key in ctx.data,
            });
        }
        if (ctx.common.async) {
            return parseUtil/* ParseStatus.mergeObjectAsync */.Q9.mergeObjectAsync(status, pairs);
        }
        else {
            return parseUtil/* ParseStatus.mergeObjectSync */.Q9.mergeObjectSync(status, pairs);
        }
    }
    get element() {
        return this._def.valueType;
    }
    static create(first, second, third) {
        if (second instanceof ZodType) {
            return new ZodRecord({
                keyType: first,
                valueType: second,
                typeName: ZodFirstPartyTypeKind.ZodRecord,
                ...processCreateParams(third),
            });
        }
        return new ZodRecord({
            keyType: ZodString.create(),
            valueType: first,
            typeName: ZodFirstPartyTypeKind.ZodRecord,
            ...processCreateParams(second),
        });
    }
}
class ZodMap extends ZodType {
    get keySchema() {
        return this._def.keyType;
    }
    get valueSchema() {
        return this._def.valueType;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util/* ZodParsedType.map */.$k.map) {
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.map */.$k.map,
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
            return {
                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
                value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"])),
            };
        });
        if (ctx.common.async) {
            const finalMap = new Map();
            return Promise.resolve().then(async () => {
                for (const pair of pairs) {
                    const key = await pair.key;
                    const value = await pair.value;
                    if (key.status === "aborted" || value.status === "aborted") {
                        return parseUtil/* INVALID */.UI;
                    }
                    if (key.status === "dirty" || value.status === "dirty") {
                        status.dirty();
                    }
                    finalMap.set(key.value, value.value);
                }
                return { status: status.value, value: finalMap };
            });
        }
        else {
            const finalMap = new Map();
            for (const pair of pairs) {
                const key = pair.key;
                const value = pair.value;
                if (key.status === "aborted" || value.status === "aborted") {
                    return parseUtil/* INVALID */.UI;
                }
                if (key.status === "dirty" || value.status === "dirty") {
                    status.dirty();
                }
                finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
        }
    }
}
ZodMap.create = (keyType, valueType, params) => {
    return new ZodMap({
        valueType,
        keyType,
        typeName: ZodFirstPartyTypeKind.ZodMap,
        ...processCreateParams(params),
    });
};
class ZodSet extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util/* ZodParsedType.set */.$k.set) {
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.set */.$k.set,
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        const def = this._def;
        if (def.minSize !== null) {
            if (ctx.data.size < def.minSize.value) {
                (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                    code: ZodError/* ZodIssueCode.too_small */.NL.too_small,
                    minimum: def.minSize.value,
                    type: "set",
                    inclusive: true,
                    exact: false,
                    message: def.minSize.message,
                });
                status.dirty();
            }
        }
        if (def.maxSize !== null) {
            if (ctx.data.size > def.maxSize.value) {
                (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                    code: ZodError/* ZodIssueCode.too_big */.NL.too_big,
                    maximum: def.maxSize.value,
                    type: "set",
                    inclusive: true,
                    exact: false,
                    message: def.maxSize.message,
                });
                status.dirty();
            }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements) {
            const parsedSet = new Set();
            for (const element of elements) {
                if (element.status === "aborted")
                    return parseUtil/* INVALID */.UI;
                if (element.status === "dirty")
                    status.dirty();
                parsedSet.add(element.value);
            }
            return { status: status.value, value: parsedSet };
        }
        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
        if (ctx.common.async) {
            return Promise.all(elements).then((elements) => finalizeSet(elements));
        }
        else {
            return finalizeSet(elements);
        }
    }
    min(minSize, message) {
        return new ZodSet({
            ...this._def,
            minSize: { value: minSize, message: errorUtil.toString(message) },
        });
    }
    max(maxSize, message) {
        return new ZodSet({
            ...this._def,
            maxSize: { value: maxSize, message: errorUtil.toString(message) },
        });
    }
    size(size, message) {
        return this.min(size, message).max(size, message);
    }
    nonempty(message) {
        return this.min(1, message);
    }
}
ZodSet.create = (valueType, params) => {
    return new ZodSet({
        valueType,
        minSize: null,
        maxSize: null,
        typeName: ZodFirstPartyTypeKind.ZodSet,
        ...processCreateParams(params),
    });
};
class ZodFunction extends ZodType {
    constructor() {
        super(...arguments);
        this.validate = this.implement;
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util/* ZodParsedType.function */.$k["function"]) {
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.function */.$k["function"],
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        function makeArgsIssue(args, error) {
            return (0,parseUtil/* makeIssue */.Xm)({
                data: args,
                path: ctx.path,
                errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, (0,errors/* getErrorMap */.Pr)(), en/* default */.Z].filter((x) => !!x),
                issueData: {
                    code: ZodError/* ZodIssueCode.invalid_arguments */.NL.invalid_arguments,
                    argumentsError: error,
                },
            });
        }
        function makeReturnsIssue(returns, error) {
            return (0,parseUtil/* makeIssue */.Xm)({
                data: returns,
                path: ctx.path,
                errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, (0,errors/* getErrorMap */.Pr)(), en/* default */.Z].filter((x) => !!x),
                issueData: {
                    code: ZodError/* ZodIssueCode.invalid_return_type */.NL.invalid_return_type,
                    returnTypeError: error,
                },
            });
        }
        const params = { errorMap: ctx.common.contextualErrorMap };
        const fn = ctx.data;
        if (this._def.returns instanceof ZodPromise) {
            // Would love a way to avoid disabling this rule, but we need
            // an alias (using an arrow function was what caused 2651).
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const me = this;
            return (0,parseUtil.OK)(async function (...args) {
                const error = new ZodError/* ZodError */.jm([]);
                const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
                    error.addIssue(makeArgsIssue(args, e));
                    throw error;
                });
                const result = await Reflect.apply(fn, this, parsedArgs);
                const parsedReturns = await me._def.returns._def.type
                    .parseAsync(result, params)
                    .catch((e) => {
                    error.addIssue(makeReturnsIssue(result, e));
                    throw error;
                });
                return parsedReturns;
            });
        }
        else {
            // Would love a way to avoid disabling this rule, but we need
            // an alias (using an arrow function was what caused 2651).
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const me = this;
            return (0,parseUtil.OK)(function (...args) {
                const parsedArgs = me._def.args.safeParse(args, params);
                if (!parsedArgs.success) {
                    throw new ZodError/* ZodError */.jm([makeArgsIssue(args, parsedArgs.error)]);
                }
                const result = Reflect.apply(fn, this, parsedArgs.data);
                const parsedReturns = me._def.returns.safeParse(result, params);
                if (!parsedReturns.success) {
                    throw new ZodError/* ZodError */.jm([makeReturnsIssue(result, parsedReturns.error)]);
                }
                return parsedReturns.data;
            });
        }
    }
    parameters() {
        return this._def.args;
    }
    returnType() {
        return this._def.returns;
    }
    args(...items) {
        return new ZodFunction({
            ...this._def,
            args: ZodTuple.create(items).rest(ZodUnknown.create()),
        });
    }
    returns(returnType) {
        return new ZodFunction({
            ...this._def,
            returns: returnType,
        });
    }
    implement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
    }
    strictImplement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
    }
    static create(args, returns, params) {
        return new ZodFunction({
            args: (args ? args : ZodTuple.create([]).rest(ZodUnknown.create())),
            returns: returns || ZodUnknown.create(),
            typeName: ZodFirstPartyTypeKind.ZodFunction,
            ...processCreateParams(params),
        });
    }
}
class ZodLazy extends ZodType {
    get schema() {
        return this._def.getter();
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
    }
}
ZodLazy.create = (getter, params) => {
    return new ZodLazy({
        getter: getter,
        typeName: ZodFirstPartyTypeKind.ZodLazy,
        ...processCreateParams(params),
    });
};
class ZodLiteral extends ZodType {
    _parse(input) {
        if (input.data !== this._def.value) {
            const ctx = this._getOrReturnCtx(input);
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                received: ctx.data,
                code: ZodError/* ZodIssueCode.invalid_literal */.NL.invalid_literal,
                expected: this._def.value,
            });
            return parseUtil/* INVALID */.UI;
        }
        return { status: "valid", value: input.data };
    }
    get value() {
        return this._def.value;
    }
}
ZodLiteral.create = (value, params) => {
    return new ZodLiteral({
        value: value,
        typeName: ZodFirstPartyTypeKind.ZodLiteral,
        ...processCreateParams(params),
    });
};
function createZodEnum(values, params) {
    return new ZodEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodEnum,
        ...processCreateParams(params),
    });
}
class ZodEnum extends ZodType {
    _parse(input) {
        if (typeof input.data !== "string") {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                expected: util/* util.joinValues */.D5.joinValues(expectedValues),
                received: ctx.parsedType,
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
            });
            return parseUtil/* INVALID */.UI;
        }
        if (!this._cache) {
            this._cache = new Set(this._def.values);
        }
        if (!this._cache.has(input.data)) {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                received: ctx.data,
                code: ZodError/* ZodIssueCode.invalid_enum_value */.NL.invalid_enum_value,
                options: expectedValues,
            });
            return parseUtil/* INVALID */.UI;
        }
        return (0,parseUtil.OK)(input.data);
    }
    get options() {
        return this._def.values;
    }
    get enum() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    get Values() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    get Enum() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    extract(values, newDef = this._def) {
        return ZodEnum.create(values, {
            ...this._def,
            ...newDef,
        });
    }
    exclude(values, newDef = this._def) {
        return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
            ...this._def,
            ...newDef,
        });
    }
}
ZodEnum.create = createZodEnum;
class ZodNativeEnum extends ZodType {
    _parse(input) {
        const nativeEnumValues = util/* util.getValidEnumValues */.D5.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== util/* ZodParsedType.string */.$k.string && ctx.parsedType !== util/* ZodParsedType.number */.$k.number) {
            const expectedValues = util/* util.objectValues */.D5.objectValues(nativeEnumValues);
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                expected: util/* util.joinValues */.D5.joinValues(expectedValues),
                received: ctx.parsedType,
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
            });
            return parseUtil/* INVALID */.UI;
        }
        if (!this._cache) {
            this._cache = new Set(util/* util.getValidEnumValues */.D5.getValidEnumValues(this._def.values));
        }
        if (!this._cache.has(input.data)) {
            const expectedValues = util/* util.objectValues */.D5.objectValues(nativeEnumValues);
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                received: ctx.data,
                code: ZodError/* ZodIssueCode.invalid_enum_value */.NL.invalid_enum_value,
                options: expectedValues,
            });
            return parseUtil/* INVALID */.UI;
        }
        return (0,parseUtil.OK)(input.data);
    }
    get enum() {
        return this._def.values;
    }
}
ZodNativeEnum.create = (values, params) => {
    return new ZodNativeEnum({
        values: values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params),
    });
};
class ZodPromise extends ZodType {
    unwrap() {
        return this._def.type;
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util/* ZodParsedType.promise */.$k.promise && ctx.common.async === false) {
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.promise */.$k.promise,
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        const promisified = ctx.parsedType === util/* ZodParsedType.promise */.$k.promise ? ctx.data : Promise.resolve(ctx.data);
        return (0,parseUtil.OK)(promisified.then((data) => {
            return this._def.type.parseAsync(data, {
                path: ctx.path,
                errorMap: ctx.common.contextualErrorMap,
            });
        }));
    }
}
ZodPromise.create = (schema, params) => {
    return new ZodPromise({
        type: schema,
        typeName: ZodFirstPartyTypeKind.ZodPromise,
        ...processCreateParams(params),
    });
};
class ZodEffects extends ZodType {
    innerType() {
        return this._def.schema;
    }
    sourceType() {
        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects
            ? this._def.schema.sourceType()
            : this._def.schema;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        const checkCtx = {
            addIssue: (arg) => {
                (0,parseUtil/* addIssueToContext */.KD)(ctx, arg);
                if (arg.fatal) {
                    status.abort();
                }
                else {
                    status.dirty();
                }
            },
            get path() {
                return ctx.path;
            },
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "preprocess") {
            const processed = effect.transform(ctx.data, checkCtx);
            if (ctx.common.async) {
                return Promise.resolve(processed).then(async (processed) => {
                    if (status.value === "aborted")
                        return parseUtil/* INVALID */.UI;
                    const result = await this._def.schema._parseAsync({
                        data: processed,
                        path: ctx.path,
                        parent: ctx,
                    });
                    if (result.status === "aborted")
                        return parseUtil/* INVALID */.UI;
                    if (result.status === "dirty")
                        return (0,parseUtil/* DIRTY */.RC)(result.value);
                    if (status.value === "dirty")
                        return (0,parseUtil/* DIRTY */.RC)(result.value);
                    return result;
                });
            }
            else {
                if (status.value === "aborted")
                    return parseUtil/* INVALID */.UI;
                const result = this._def.schema._parseSync({
                    data: processed,
                    path: ctx.path,
                    parent: ctx,
                });
                if (result.status === "aborted")
                    return parseUtil/* INVALID */.UI;
                if (result.status === "dirty")
                    return (0,parseUtil/* DIRTY */.RC)(result.value);
                if (status.value === "dirty")
                    return (0,parseUtil/* DIRTY */.RC)(result.value);
                return result;
            }
        }
        if (effect.type === "refinement") {
            const executeRefinement = (acc) => {
                const result = effect.refinement(acc, checkCtx);
                if (ctx.common.async) {
                    return Promise.resolve(result);
                }
                if (result instanceof Promise) {
                    throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
                }
                return acc;
            };
            if (ctx.common.async === false) {
                const inner = this._def.schema._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (inner.status === "aborted")
                    return parseUtil/* INVALID */.UI;
                if (inner.status === "dirty")
                    status.dirty();
                // return value is ignored
                executeRefinement(inner.value);
                return { status: status.value, value: inner.value };
            }
            else {
                return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
                    if (inner.status === "aborted")
                        return parseUtil/* INVALID */.UI;
                    if (inner.status === "dirty")
                        status.dirty();
                    return executeRefinement(inner.value).then(() => {
                        return { status: status.value, value: inner.value };
                    });
                });
            }
        }
        if (effect.type === "transform") {
            if (ctx.common.async === false) {
                const base = this._def.schema._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (!(0,parseUtil/* isValid */.JY)(base))
                    return parseUtil/* INVALID */.UI;
                const result = effect.transform(base.value, checkCtx);
                if (result instanceof Promise) {
                    throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
                }
                return { status: status.value, value: result };
            }
            else {
                return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
                    if (!(0,parseUtil/* isValid */.JY)(base))
                        return parseUtil/* INVALID */.UI;
                    return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
                        status: status.value,
                        value: result,
                    }));
                });
            }
        }
        util/* util.assertNever */.D5.assertNever(effect);
    }
}
ZodEffects.create = (schema, effect, params) => {
    return new ZodEffects({
        schema,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect,
        ...processCreateParams(params),
    });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
    return new ZodEffects({
        schema,
        effect: { type: "preprocess", transform: preprocess },
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params),
    });
};

class ZodOptional extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === util/* ZodParsedType.undefined */.$k.undefined) {
            return (0,parseUtil.OK)(undefined);
        }
        return this._def.innerType._parse(input);
    }
    unwrap() {
        return this._def.innerType;
    }
}
ZodOptional.create = (type, params) => {
    return new ZodOptional({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional,
        ...processCreateParams(params),
    });
};
class ZodNullable extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === util/* ZodParsedType.null */.$k["null"]) {
            return (0,parseUtil.OK)(null);
        }
        return this._def.innerType._parse(input);
    }
    unwrap() {
        return this._def.innerType;
    }
}
ZodNullable.create = (type, params) => {
    return new ZodNullable({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodNullable,
        ...processCreateParams(params),
    });
};
class ZodDefault extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === util/* ZodParsedType.undefined */.$k.undefined) {
            data = this._def.defaultValue();
        }
        return this._def.innerType._parse({
            data,
            path: ctx.path,
            parent: ctx,
        });
    }
    removeDefault() {
        return this._def.innerType;
    }
}
ZodDefault.create = (type, params) => {
    return new ZodDefault({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodDefault,
        defaultValue: typeof params.default === "function" ? params.default : () => params.default,
        ...processCreateParams(params),
    });
};
class ZodCatch extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        // newCtx is used to not collect issues from inner types in ctx
        const newCtx = {
            ...ctx,
            common: {
                ...ctx.common,
                issues: [],
            },
        };
        const result = this._def.innerType._parse({
            data: newCtx.data,
            path: newCtx.path,
            parent: {
                ...newCtx,
            },
        });
        if ((0,parseUtil/* isAsync */.S9)(result)) {
            return result.then((result) => {
                return {
                    status: "valid",
                    value: result.status === "valid"
                        ? result.value
                        : this._def.catchValue({
                            get error() {
                                return new ZodError/* ZodError */.jm(newCtx.common.issues);
                            },
                            input: newCtx.data,
                        }),
                };
            });
        }
        else {
            return {
                status: "valid",
                value: result.status === "valid"
                    ? result.value
                    : this._def.catchValue({
                        get error() {
                            return new ZodError/* ZodError */.jm(newCtx.common.issues);
                        },
                        input: newCtx.data,
                    }),
            };
        }
    }
    removeCatch() {
        return this._def.innerType;
    }
}
ZodCatch.create = (type, params) => {
    return new ZodCatch({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodCatch,
        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
        ...processCreateParams(params),
    });
};
class ZodNaN extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util/* ZodParsedType.nan */.$k.nan) {
            const ctx = this._getOrReturnCtx(input);
            (0,parseUtil/* addIssueToContext */.KD)(ctx, {
                code: ZodError/* ZodIssueCode.invalid_type */.NL.invalid_type,
                expected: util/* ZodParsedType.nan */.$k.nan,
                received: ctx.parsedType,
            });
            return parseUtil/* INVALID */.UI;
        }
        return { status: "valid", value: input.data };
    }
}
ZodNaN.create = (params) => {
    return new ZodNaN({
        typeName: ZodFirstPartyTypeKind.ZodNaN,
        ...processCreateParams(params),
    });
};
const BRAND = Symbol("zod_brand");
class ZodBranded extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
            data,
            path: ctx.path,
            parent: ctx,
        });
    }
    unwrap() {
        return this._def.type;
    }
}
class ZodPipeline extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.common.async) {
            const handleAsync = async () => {
                const inResult = await this._def.in._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (inResult.status === "aborted")
                    return parseUtil/* INVALID */.UI;
                if (inResult.status === "dirty") {
                    status.dirty();
                    return (0,parseUtil/* DIRTY */.RC)(inResult.value);
                }
                else {
                    return this._def.out._parseAsync({
                        data: inResult.value,
                        path: ctx.path,
                        parent: ctx,
                    });
                }
            };
            return handleAsync();
        }
        else {
            const inResult = this._def.in._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
            if (inResult.status === "aborted")
                return parseUtil/* INVALID */.UI;
            if (inResult.status === "dirty") {
                status.dirty();
                return {
                    status: "dirty",
                    value: inResult.value,
                };
            }
            else {
                return this._def.out._parseSync({
                    data: inResult.value,
                    path: ctx.path,
                    parent: ctx,
                });
            }
        }
    }
    static create(a, b) {
        return new ZodPipeline({
            in: a,
            out: b,
            typeName: ZodFirstPartyTypeKind.ZodPipeline,
        });
    }
}
class ZodReadonly extends ZodType {
    _parse(input) {
        const result = this._def.innerType._parse(input);
        const freeze = (data) => {
            if ((0,parseUtil/* isValid */.JY)(data)) {
                data.value = Object.freeze(data.value);
            }
            return data;
        };
        return (0,parseUtil/* isAsync */.S9)(result) ? result.then((data) => freeze(data)) : freeze(result);
    }
    unwrap() {
        return this._def.innerType;
    }
}
ZodReadonly.create = (type, params) => {
    return new ZodReadonly({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodReadonly,
        ...processCreateParams(params),
    });
};
////////////////////////////////////////
////////////////////////////////////////
//////////                    //////////
//////////      z.custom      //////////
//////////                    //////////
////////////////////////////////////////
////////////////////////////////////////
function cleanParams(params, data) {
    const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
    const p2 = typeof p === "string" ? { message: p } : p;
    return p2;
}
function custom(check, _params = {}, 
/**
 * @deprecated
 *
 * Pass `fatal` into the params object instead:
 *
 * ```ts
 * z.string().custom((val) => val.length > 5, { fatal: false })
 * ```
 *
 */
fatal) {
    if (check)
        return ZodAny.create().superRefine((data, ctx) => {
            const r = check(data);
            if (r instanceof Promise) {
                return r.then((r) => {
                    if (!r) {
                        const params = cleanParams(_params, data);
                        const _fatal = params.fatal ?? fatal ?? true;
                        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
                    }
                });
            }
            if (!r) {
                const params = cleanParams(_params, data);
                const _fatal = params.fatal ?? fatal ?? true;
                ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
            }
            return;
        });
    return ZodAny.create();
}

const late = {
    object: ZodObject.lazycreate,
};
var ZodFirstPartyTypeKind;
(function (ZodFirstPartyTypeKind) {
    ZodFirstPartyTypeKind["ZodString"] = "ZodString";
    ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
    ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
    ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
    ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
    ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
    ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
    ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
    ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
    ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
    ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
    ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
    ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
    ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
    ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
    ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
    ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
    ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
    ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
    ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
    ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
    ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
    ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
    ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
    ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
    ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
    ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
    ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
    ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
    ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
    ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
    ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
    ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
    ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
    ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
    ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
// requires TS 4.4+
class Class {
    constructor(..._) { }
}
const instanceOfType = (
// const instanceOfType = <T extends new (...args: any[]) => any>(
cls, params = {
    message: `Input not instance of ${cls.name}`,
}) => custom((data) => data instanceof cls, params);
const stringType = ZodString.create;
const numberType = ZodNumber.create;
const nanType = ZodNaN.create;
const bigIntType = ZodBigInt.create;
const booleanType = ZodBoolean.create;
const dateType = ZodDate.create;
const symbolType = ZodSymbol.create;
const undefinedType = ZodUndefined.create;
const nullType = ZodNull.create;
const anyType = ZodAny.create;
const unknownType = ZodUnknown.create;
const neverType = ZodNever.create;
const voidType = ZodVoid.create;
const arrayType = ZodArray.create;
const objectType = ZodObject.create;
const strictObjectType = ZodObject.strictCreate;
const unionType = ZodUnion.create;
const discriminatedUnionType = ZodDiscriminatedUnion.create;
const intersectionType = ZodIntersection.create;
const tupleType = ZodTuple.create;
const recordType = ZodRecord.create;
const mapType = ZodMap.create;
const setType = ZodSet.create;
const functionType = ZodFunction.create;
const lazyType = ZodLazy.create;
const literalType = ZodLiteral.create;
const enumType = ZodEnum.create;
const nativeEnumType = ZodNativeEnum.create;
const promiseType = ZodPromise.create;
const effectsType = ZodEffects.create;
const optionalType = ZodOptional.create;
const nullableType = ZodNullable.create;
const preprocessType = ZodEffects.createWithPreprocess;
const pipelineType = ZodPipeline.create;
const ostring = () => stringType().optional();
const onumber = () => numberType().optional();
const oboolean = () => booleanType().optional();
const coerce = {
    string: ((arg) => ZodString.create({ ...arg, coerce: true })),
    number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
    boolean: ((arg) => ZodBoolean.create({
        ...arg,
        coerce: true,
    })),
    bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
    date: ((arg) => ZodDate.create({ ...arg, coerce: true })),
};

const NEVER = parseUtil/* INVALID */.UI;


/***/ })

};
;