/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Blueprint functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.measureTypeIntoReadableUnit = void 0;
/** Format object to pretty JSON */
Pulsar.registerFunction("objectToPrettyJson", (object) => {
    return JSON.stringify(object, null, 2);
});
/** Generate style dictionary tree */
Pulsar.registerFunction("generateStyleDictionaryTree", (rootGroup, allTokens, allGroups) => {
    let writeRoot = {};
    // Compute full data structure of the entire type-dependent tree
    let result = representTree(rootGroup, allTokens, allGroups, writeRoot);
    debugger;
    // Add top level entries which don't belong to any user-defined group
    for (let token of tokensOfGroup(rootGroup, allTokens)) {
        result[safeTokenName(token)] = representToken(token, allTokens, allGroups);
    }
    // Retrieve
    return {
        [`${typeLabel(rootGroup.tokenType)}`]: result,
    };
});
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Tree construction
/** Construct tree out of one specific group, independent of tree type */
function representTree(rootGroup, allTokens, allGroups, writeObject) {
    // Represent one level of groups and tokens inside tree. Creates subobjects and then also information about each token
    for (let group of rootGroup.subgroups) {
        // Write buffer
        let writeSubObject = {};
        // Add each entry for each subgroup, and represent its tree into it
        writeObject[safeGroupName(group)] = representTree(group, allTokens, allGroups, writeSubObject);
        // Add each entry for each token, writing to the same write root
        for (let token of tokensOfGroup(group, allTokens)) {
            writeSubObject[safeTokenName(token)] = representToken(token, allTokens, allGroups);
        }
    }
    return writeObject;
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Token Representation
/** Represent a singular token as SD object */
function representToken(token, allTokens, allGroups) {
    switch (token.tokenType) {
        case "Color":
            return representColorToken(token, allTokens, allGroups);
        case "Border":
            return representBorderToken(token, allTokens, allGroups);
        case 'Font':
            return representFontToken(token, allTokens, allGroups);
        case "GenericToken":
            return representGenericToken(token, allTokens, allGroups);
        case "Gradient":
            return representGradientToken(token, allTokens, allGroups);
        case "Measure":
            return representMeasureToken(token, allTokens, allGroups);
        case "Radius":
            return representRadiusToken(token, allTokens, allGroups);
        case "Shadow":
            return representShadowToken(token, allTokens, allGroups);
        case "Text":
            return representTextToken(token, allTokens, allGroups);
        case "Typography":
            return representTypographyToken(token, allTokens, allGroups);
    }
}
/** Represent full color token, including wrapping meta-information such as user description */
function representColorToken(token, allTokens, allGroups) {
    let value = representColorTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full border token, including wrapping meta-information such as user description */
function representBorderToken(token, allTokens, allGroups) {
    let value = representBorderTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full font token, including wrapping meta-information such as user description */
function representFontToken(token, allTokens, allGroups) {
    let value = representFontFamilyTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full gradient token, including wrapping meta-information such as user description */
function representGradientToken(token, allTokens, allGroups) {
    let value = representGradientTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full measure token, including wrapping meta-information such as user description */
function representMeasureToken(token, allTokens, allGroups) {
    let value = representMeasureTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full generic token, including wrapping meta-information such as user description */
function representGenericToken(token, allTokens, allGroups) {
    let value = representGenericTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full radius token, including wrapping meta-information such as user description */
function representRadiusToken(token, allTokens, allGroups) {
    let value = representRadiusTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full shadow token, including wrapping meta-information such as user description */
function representShadowToken(token, allTokens, allGroups) {
    let value = representShadowTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full text token, including wrapping meta-information such as user description */
function representTextToken(token, allTokens, allGroups) {
    let value = representTextTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full typography token, including wrapping meta-information such as user description */
function representTypographyToken(token, allTokens, allGroups) {
    let value = representTypographyTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Token Value Representation
/** Represent color token value either as reference or as plain representation */
function representColorTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = `#${value.hex}`;
    }
    return result;
}
/** Represent radius token value either as reference or as plain representation */
function representRadiusTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            radius: {
                type: "measure",
                value: representMeasureTokenValue(value.radius, allTokens, allGroups),
            },
            topLeft: value.topLeft
                ? {
                    type: "measure",
                    value: representMeasureTokenValue(value.topLeft, allTokens, allGroups),
                }
                : undefined,
            topRight: value.topRight
                ? {
                    type: "measure",
                    value: representMeasureTokenValue(value.topRight, allTokens, allGroups),
                }
                : undefined,
            bottomLeft: value.bottomLeft
                ? {
                    type: "measure",
                    value: representMeasureTokenValue(value.bottomLeft, allTokens, allGroups),
                }
                : undefined,
            bottomRight: value.bottomRight
                ? {
                    type: "measure",
                    value: representMeasureTokenValue(value.bottomRight, allTokens, allGroups),
                }
                : undefined,
        };
    }
    return result;
}
/** Represent measure token value either as reference or as plain representation */
function representMeasureTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        result = getValueWithUnit(value.measure, value.unit);
    }
    return result;
}
function representGenericTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = value.text;
    }
    return result;
}
function getValueWithUnit(value, unit) {
    if (value === 0) {
        return `${value}`;
    }
    else {
        return `${value}${measureTypeIntoReadableUnit(unit)}`;
    }
}
/** Convert type to CSS unit */
function measureTypeIntoReadableUnit(type) {
    switch (type) {
        case "Points":
            return "pt";
        case "Pixels":
            return "px";
        case "Percent":
            return "%";
        case "Ems":
            return "em";
        default:
            return "";
    }
}
exports.measureTypeIntoReadableUnit = measureTypeIntoReadableUnit;
/** Represent font weight value either as reference or as plain representation */
function representFontFamilyTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = value.family;
    }
    return result;
}
/** Represent font weight value either as reference or as plain representation */
function representFontWeightTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = value.subfamily;
    }
    return result;
}
/** Represent text token value either as reference or as plain representation */
function representTextTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = value.text;
    }
    return result;
}
/** Represent typography token value either as reference or as plain representation */
function representTypographyTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            fontFamily: representFontFamilyTokenValue(value.font, allTokens, allGroups),
            fontSize: 'text' in value.fontSize ? representGenericTokenValue(value.fontSize, allTokens, allGroups) : representMeasureTokenValue(value.fontSize, allTokens, allGroups),
            fontWeight: representFontWeightTokenValue(value.font, allTokens, allGroups),
            letterSpacing: representMeasureTokenValue(value.letterSpacing, allTokens, allGroups),
            lineHeight: value.lineHeight
                ? ('text' in value.lineHeight ? representGenericTokenValue(value.lineHeight, allTokens, allGroups) : representMeasureTokenValue(value.lineHeight, allTokens, allGroups))
                : undefined,
        };
    }
    return result;
}
/** Represent border token value either as reference or as plain representation */
function representBorderTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            color: {
                type: "color",
                value: representColorTokenValue(value.color, allTokens, allGroups),
            },
            width: {
                type: "measure",
                value: representMeasureTokenValue(value.width, allTokens, allGroups),
            },
            position: {
                type: "string",
                value: value.position,
            },
        };
    }
    return result;
}
/** Represent shadow token value either as reference or as plain representation */
function representShadowTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            color: representColorTokenValue(value.color, allTokens, allGroups),
            offsetX: representMeasureTokenValue(value.x, allTokens, allGroups),
            offsetY: representMeasureTokenValue(value.y, allTokens, allGroups),
            blur: representMeasureTokenValue(value.radius, allTokens, allGroups),
            spread: representMeasureTokenValue(value.spread, allTokens, allGroups),
        };
    }
    return result;
}
/** Represent gradient token value either as reference or as plain representation */
function representGradientTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            to: {
                type: "point",
                value: {
                    x: {
                        type: "size",
                        value: value.to.x,
                    },
                    y: {
                        type: "size",
                        value: value.to.y,
                    },
                },
            },
            from: {
                type: "point",
                value: {
                    x: {
                        type: "size",
                        value: value.from.x,
                    },
                    y: {
                        type: "size",
                        value: value.from.y,
                    },
                },
            },
            type: {
                type: "string",
                value: value.type,
            },
            aspectRatio: {
                type: "size",
                value: value.aspectRatio,
            },
            stops: {},
        };
        // Inject gradient stops
        let count = 0;
        for (let stop of value.stops) {
            let stopObject = {
                type: "gradientStop",
                position: {
                    type: "size",
                    value: stop.position,
                },
                color: {
                    type: "color",
                    value: representColorTokenValue(stop.color, allTokens, allGroups),
                },
            };
            result.stops[`${count}`] = stopObject;
            count++;
        }
    }
    return result;
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Object wrappers
/** Retrieve wrapper to certain token (referenced by name) pointing to token value */
function referenceWrapper(reference) {
    return `{${reference}}`;
}
/** Retrieve token wrapper containing its metadata and value information (used as container for each defined token) */
function tokenWrapper(token, value) {
    var _a;
    return {
        "$value": value,
        "$type": typeLabel(token.tokenType),
        "$description": token.description.length > 0 ? token.description : undefined,
        "$extensions": {
            "org.supernova-io": {
                "id": token.id,
                "figma-style-key": token.origin ? (_a = token.origin.id) === null || _a === void 0 ? void 0 : _a.slice(2, -1) : undefined,
                "metadata": Object.keys(token.propertyValues).length > 0 ? token.propertyValues : undefined
            }
        }
    };
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Naming
/** Create full reference name representing token. Such name can, for example, look like: [g1].[g2].[g3].[g4].[token-name] */
function referenceName(token, allGroups) {
    // Find the group to which token belongs. This is really suboptimal and should be solved by the SDK to just provide the group reference
    let occurances = allGroups.filter((g) => g.tokenIds.indexOf(token.id) !== -1);
    if (occurances.length === 0) {
        throw Error("JS: Unable to find token in any of the groups");
    }
    let containingGroup = occurances[0];
    let tokenPart = safeTokenName(token);
    let groupParts = referenceGroupChain(containingGroup).map((g) => safeGroupName(g));
    return [...groupParts, tokenPart].join(".");
}
/** Retrieve safe token name made out of normal token name
 * This replace spaces with dashes, also change anything non-alphanumeric char to it as well.
 * For example, ST&RK Industries will be changed to st-rk-industries
 */
function safeTokenName(token) {
    return token.name.trim().replace(/\W+/g, "-").toLowerCase();
}
/** Retrieve safe group name made out of normal group name
 * This replace spaces with dashes, also change anything non-alphanumeric char to it as well.
 * For example, ST&RK Industries will be changed to st-rk-industries
 */
function safeGroupName(group) {
    return group.name.replace(/\W+/g, "-").toLowerCase();
}
/** Retrieve human-readable token type in unified fashion, used both as token type and as token master group */
function typeLabel(type) {
    switch (type) {
        case "Border":
            return "border";
        case "Color":
            return "color";
        case "Font":
            return "font";
        case "GenericToken":
            return "generic";
        case "Gradient":
            return "gradient";
        case "Measure":
            return "measure";
        case "Radius":
            return "radius";
        case "Shadow":
            return "shadow";
        case "Text":
            return "text";
        case "Typography":
            return "typography";
    }
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Lookup
/** Find all tokens that belong to a certain group and retrieve them as objects */
function tokensOfGroup(containingGroup, allTokens) {
    return allTokens.filter((t) => containingGroup.tokenIds.indexOf(t.id) !== -1);
}
/** Retrieve chain of groups up to a specified group, ordered from parent to children */
function referenceGroupChain(containingGroup) {
    let iteratedGroup = containingGroup;
    let chain = [containingGroup];
    while (iteratedGroup.parent) {
        chain.push(iteratedGroup.parent);
        iteratedGroup = iteratedGroup.parent;
    }
    return chain.reverse();
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRmE7QUFDYjtBQUNBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSwrQkFBK0I7QUFDM0M7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFVBQVU7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLE1BQU07QUFDeEI7QUFDQTtBQUNBLGtCQUFrQixNQUFNLEVBQUUsa0NBQWtDO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsNEJBQTRCLE1BQU07QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxFQUFFLFdBQVc7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb21waWxlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cclxuLy8gTUFSSzogLSBCbHVlcHJpbnQgZnVuY3Rpb25zXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5tZWFzdXJlVHlwZUludG9SZWFkYWJsZVVuaXQgPSB2b2lkIDA7XHJcbi8qKiBGb3JtYXQgb2JqZWN0IHRvIHByZXR0eSBKU09OICovXHJcblB1bHNhci5yZWdpc3RlckZ1bmN0aW9uKFwib2JqZWN0VG9QcmV0dHlKc29uXCIsIChvYmplY3QpID0+IHtcclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QsIG51bGwsIDIpO1xyXG59KTtcclxuLyoqIEdlbmVyYXRlIHN0eWxlIGRpY3Rpb25hcnkgdHJlZSAqL1xyXG5QdWxzYXIucmVnaXN0ZXJGdW5jdGlvbihcImdlbmVyYXRlU3R5bGVEaWN0aW9uYXJ5VHJlZVwiLCAocm9vdEdyb3VwLCBhbGxUb2tlbnMsIGFsbEdyb3VwcykgPT4ge1xyXG4gICAgbGV0IHdyaXRlUm9vdCA9IHt9O1xyXG4gICAgLy8gQ29tcHV0ZSBmdWxsIGRhdGEgc3RydWN0dXJlIG9mIHRoZSBlbnRpcmUgdHlwZS1kZXBlbmRlbnQgdHJlZVxyXG4gICAgbGV0IHJlc3VsdCA9IHJlcHJlc2VudFRyZWUocm9vdEdyb3VwLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcywgd3JpdGVSb290KTtcclxuICAgIGRlYnVnZ2VyO1xyXG4gICAgLy8gQWRkIHRvcCBsZXZlbCBlbnRyaWVzIHdoaWNoIGRvbid0IGJlbG9uZyB0byBhbnkgdXNlci1kZWZpbmVkIGdyb3VwXHJcbiAgICBmb3IgKGxldCB0b2tlbiBvZiB0b2tlbnNPZkdyb3VwKHJvb3RHcm91cCwgYWxsVG9rZW5zKSkge1xyXG4gICAgICAgIHJlc3VsdFtzYWZlVG9rZW5OYW1lKHRva2VuKV0gPSByZXByZXNlbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xyXG4gICAgfVxyXG4gICAgLy8gUmV0cmlldmVcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgW2Ake3R5cGVMYWJlbChyb290R3JvdXAudG9rZW5UeXBlKX1gXTogcmVzdWx0LFxyXG4gICAgfTtcclxufSk7XHJcbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cclxuLy8gTUFSSzogLSBUcmVlIGNvbnN0cnVjdGlvblxyXG4vKiogQ29uc3RydWN0IHRyZWUgb3V0IG9mIG9uZSBzcGVjaWZpYyBncm91cCwgaW5kZXBlbmRlbnQgb2YgdHJlZSB0eXBlICovXHJcbmZ1bmN0aW9uIHJlcHJlc2VudFRyZWUocm9vdEdyb3VwLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcywgd3JpdGVPYmplY3QpIHtcclxuICAgIC8vIFJlcHJlc2VudCBvbmUgbGV2ZWwgb2YgZ3JvdXBzIGFuZCB0b2tlbnMgaW5zaWRlIHRyZWUuIENyZWF0ZXMgc3Vib2JqZWN0cyBhbmQgdGhlbiBhbHNvIGluZm9ybWF0aW9uIGFib3V0IGVhY2ggdG9rZW5cclxuICAgIGZvciAobGV0IGdyb3VwIG9mIHJvb3RHcm91cC5zdWJncm91cHMpIHtcclxuICAgICAgICAvLyBXcml0ZSBidWZmZXJcclxuICAgICAgICBsZXQgd3JpdGVTdWJPYmplY3QgPSB7fTtcclxuICAgICAgICAvLyBBZGQgZWFjaCBlbnRyeSBmb3IgZWFjaCBzdWJncm91cCwgYW5kIHJlcHJlc2VudCBpdHMgdHJlZSBpbnRvIGl0XHJcbiAgICAgICAgd3JpdGVPYmplY3Rbc2FmZUdyb3VwTmFtZShncm91cCldID0gcmVwcmVzZW50VHJlZShncm91cCwgYWxsVG9rZW5zLCBhbGxHcm91cHMsIHdyaXRlU3ViT2JqZWN0KTtcclxuICAgICAgICAvLyBBZGQgZWFjaCBlbnRyeSBmb3IgZWFjaCB0b2tlbiwgd3JpdGluZyB0byB0aGUgc2FtZSB3cml0ZSByb290XHJcbiAgICAgICAgZm9yIChsZXQgdG9rZW4gb2YgdG9rZW5zT2ZHcm91cChncm91cCwgYWxsVG9rZW5zKSkge1xyXG4gICAgICAgICAgICB3cml0ZVN1Yk9iamVjdFtzYWZlVG9rZW5OYW1lKHRva2VuKV0gPSByZXByZXNlbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB3cml0ZU9iamVjdDtcclxufVxyXG4vLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXHJcbi8vIE1BUks6IC0gVG9rZW4gUmVwcmVzZW50YXRpb25cclxuLyoqIFJlcHJlc2VudCBhIHNpbmd1bGFyIHRva2VuIGFzIFNEIG9iamVjdCAqL1xyXG5mdW5jdGlvbiByZXByZXNlbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcclxuICAgIHN3aXRjaCAodG9rZW4udG9rZW5UeXBlKSB7XHJcbiAgICAgICAgY2FzZSBcIkNvbG9yXCI6XHJcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRDb2xvclRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XHJcbiAgICAgICAgY2FzZSBcIkJvcmRlclwiOlxyXG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50Qm9yZGVyVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcclxuICAgICAgICBjYXNlICdGb250JzpcclxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudEZvbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xyXG4gICAgICAgIGNhc2UgXCJHZW5lcmljVG9rZW5cIjpcclxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudEdlbmVyaWNUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xyXG4gICAgICAgIGNhc2UgXCJHcmFkaWVudFwiOlxyXG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50R3JhZGllbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xyXG4gICAgICAgIGNhc2UgXCJNZWFzdXJlXCI6XHJcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRNZWFzdXJlVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcclxuICAgICAgICBjYXNlIFwiUmFkaXVzXCI6XHJcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRSYWRpdXNUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xyXG4gICAgICAgIGNhc2UgXCJTaGFkb3dcIjpcclxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudFNoYWRvd1Rva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XHJcbiAgICAgICAgY2FzZSBcIlRleHRcIjpcclxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudFRleHRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xyXG4gICAgICAgIGNhc2UgXCJUeXBvZ3JhcGh5XCI6XHJcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRUeXBvZ3JhcGh5VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcclxuICAgIH1cclxufVxyXG4vKiogUmVwcmVzZW50IGZ1bGwgY29sb3IgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xyXG5mdW5jdGlvbiByZXByZXNlbnRDb2xvclRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xyXG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50Q29sb3JUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XHJcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XHJcbn1cclxuLyoqIFJlcHJlc2VudCBmdWxsIGJvcmRlciB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXHJcbmZ1bmN0aW9uIHJlcHJlc2VudEJvcmRlclRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xyXG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50Qm9yZGVyVG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xyXG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xyXG59XHJcbi8qKiBSZXByZXNlbnQgZnVsbCBmb250IHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cclxuZnVuY3Rpb24gcmVwcmVzZW50Rm9udFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xyXG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50Rm9udEZhbWlseVRva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcclxuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcclxufVxyXG4vKiogUmVwcmVzZW50IGZ1bGwgZ3JhZGllbnQgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xyXG5mdW5jdGlvbiByZXByZXNlbnRHcmFkaWVudFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xyXG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50R3JhZGllbnRUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XHJcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XHJcbn1cclxuLyoqIFJlcHJlc2VudCBmdWxsIG1lYXN1cmUgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xyXG5mdW5jdGlvbiByZXByZXNlbnRNZWFzdXJlVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XHJcbiAgICBsZXQgdmFsdWUgPSByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xyXG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xyXG59XHJcbi8qKiBSZXByZXNlbnQgZnVsbCBnZW5lcmljIHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cclxuZnVuY3Rpb24gcmVwcmVzZW50R2VuZXJpY1Rva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xyXG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50R2VuZXJpY1Rva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcclxuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcclxufVxyXG4vKiogUmVwcmVzZW50IGZ1bGwgcmFkaXVzIHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cclxuZnVuY3Rpb24gcmVwcmVzZW50UmFkaXVzVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XHJcbiAgICBsZXQgdmFsdWUgPSByZXByZXNlbnRSYWRpdXNUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XHJcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XHJcbn1cclxuLyoqIFJlcHJlc2VudCBmdWxsIHNoYWRvdyB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXHJcbmZ1bmN0aW9uIHJlcHJlc2VudFNoYWRvd1Rva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xyXG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50U2hhZG93VG9rZW5WYWx1ZSh0b2tlbi52YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xyXG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xyXG59XHJcbi8qKiBSZXByZXNlbnQgZnVsbCB0ZXh0IHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cclxuZnVuY3Rpb24gcmVwcmVzZW50VGV4dFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xyXG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50VGV4dFRva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcclxuICAgIHJldHVybiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKTtcclxufVxyXG4vKiogUmVwcmVzZW50IGZ1bGwgdHlwb2dyYXBoeSB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXHJcbmZ1bmN0aW9uIHJlcHJlc2VudFR5cG9ncmFwaHlUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcclxuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudFR5cG9ncmFwaHlUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XHJcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XHJcbn1cclxuLy8gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLVxyXG4vLyBNQVJLOiAtIFRva2VuIFZhbHVlIFJlcHJlc2VudGF0aW9uXHJcbi8qKiBSZXByZXNlbnQgY29sb3IgdG9rZW4gdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xyXG5mdW5jdGlvbiByZXByZXNlbnRDb2xvclRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XHJcbiAgICBsZXQgcmVzdWx0O1xyXG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xyXG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxyXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gUmF3IHZhbHVlXHJcbiAgICAgICAgcmVzdWx0ID0gYCMke3ZhbHVlLmhleH1gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG4vKiogUmVwcmVzZW50IHJhZGl1cyB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXHJcbmZ1bmN0aW9uIHJlcHJlc2VudFJhZGl1c1Rva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XHJcbiAgICBsZXQgcmVzdWx0O1xyXG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xyXG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxyXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gUmF3IHZhbHVlXHJcbiAgICAgICAgcmVzdWx0ID0ge1xyXG4gICAgICAgICAgICByYWRpdXM6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLnJhZGl1cywgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b3BMZWZ0OiB2YWx1ZS50b3BMZWZ0XHJcbiAgICAgICAgICAgICAgICA/IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUudG9wTGVmdCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIHRvcFJpZ2h0OiB2YWx1ZS50b3BSaWdodFxyXG4gICAgICAgICAgICAgICAgPyB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLnRvcFJpZ2h0LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgYm90dG9tTGVmdDogdmFsdWUuYm90dG9tTGVmdFxyXG4gICAgICAgICAgICAgICAgPyB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLmJvdHRvbUxlZnQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBib3R0b21SaWdodDogdmFsdWUuYm90dG9tUmlnaHRcclxuICAgICAgICAgICAgICAgID8ge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5ib3R0b21SaWdodCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuLyoqIFJlcHJlc2VudCBtZWFzdXJlIHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cclxuZnVuY3Rpb24gcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XHJcbiAgICBsZXQgcmVzdWx0O1xyXG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xyXG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxyXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gZ2V0VmFsdWVXaXRoVW5pdCh2YWx1ZS5tZWFzdXJlLCB2YWx1ZS51bml0KTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZnVuY3Rpb24gcmVwcmVzZW50R2VuZXJpY1Rva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XHJcbiAgICBsZXQgcmVzdWx0O1xyXG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xyXG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxyXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gUmF3IHZhbHVlXHJcbiAgICAgICAgcmVzdWx0ID0gdmFsdWUudGV4dDtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZnVuY3Rpb24gZ2V0VmFsdWVXaXRoVW5pdCh2YWx1ZSwgdW5pdCkge1xyXG4gICAgaWYgKHZhbHVlID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYCR7dmFsdWV9JHttZWFzdXJlVHlwZUludG9SZWFkYWJsZVVuaXQodW5pdCl9YDtcclxuICAgIH1cclxufVxyXG4vKiogQ29udmVydCB0eXBlIHRvIENTUyB1bml0ICovXHJcbmZ1bmN0aW9uIG1lYXN1cmVUeXBlSW50b1JlYWRhYmxlVW5pdCh0eXBlKSB7XHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICBjYXNlIFwiUG9pbnRzXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBcInB0XCI7XHJcbiAgICAgICAgY2FzZSBcIlBpeGVsc1wiOlxyXG4gICAgICAgICAgICByZXR1cm4gXCJweFwiO1xyXG4gICAgICAgIGNhc2UgXCJQZXJjZW50XCI6XHJcbiAgICAgICAgICAgIHJldHVybiBcIiVcIjtcclxuICAgICAgICBjYXNlIFwiRW1zXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBcImVtXCI7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5tZWFzdXJlVHlwZUludG9SZWFkYWJsZVVuaXQgPSBtZWFzdXJlVHlwZUludG9SZWFkYWJsZVVuaXQ7XHJcbi8qKiBSZXByZXNlbnQgZm9udCB3ZWlnaHQgdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xyXG5mdW5jdGlvbiByZXByZXNlbnRGb250RmFtaWx5VG9rZW5WYWx1ZSh2YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcclxuICAgIGxldCByZXN1bHQ7XHJcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XHJcbiAgICAgICAgLy8gRm9ybXMgcmVmZXJlbmNlXHJcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBSYXcgdmFsdWVcclxuICAgICAgICByZXN1bHQgPSB2YWx1ZS5mYW1pbHk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbi8qKiBSZXByZXNlbnQgZm9udCB3ZWlnaHQgdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xyXG5mdW5jdGlvbiByZXByZXNlbnRGb250V2VpZ2h0VG9rZW5WYWx1ZSh2YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcclxuICAgIGxldCByZXN1bHQ7XHJcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XHJcbiAgICAgICAgLy8gRm9ybXMgcmVmZXJlbmNlXHJcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBSYXcgdmFsdWVcclxuICAgICAgICByZXN1bHQgPSB2YWx1ZS5zdWJmYW1pbHk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbi8qKiBSZXByZXNlbnQgdGV4dCB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXHJcbmZ1bmN0aW9uIHJlcHJlc2VudFRleHRUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xyXG4gICAgbGV0IHJlc3VsdDtcclxuICAgIGlmICh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4pIHtcclxuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcclxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIFJhdyB2YWx1ZVxyXG4gICAgICAgIHJlc3VsdCA9IHZhbHVlLnRleHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbi8qKiBSZXByZXNlbnQgdHlwb2dyYXBoeSB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXHJcbmZ1bmN0aW9uIHJlcHJlc2VudFR5cG9ncmFwaHlUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xyXG4gICAgbGV0IHJlc3VsdDtcclxuICAgIGlmICh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4pIHtcclxuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcclxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIFJhdyB2YWx1ZVxyXG4gICAgICAgIHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgZm9udEZhbWlseTogcmVwcmVzZW50Rm9udEZhbWlseVRva2VuVmFsdWUodmFsdWUuZm9udCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxyXG4gICAgICAgICAgICBmb250U2l6ZTogJ3RleHQnIGluIHZhbHVlLmZvbnRTaXplID8gcmVwcmVzZW50R2VuZXJpY1Rva2VuVmFsdWUodmFsdWUuZm9udFNpemUsIGFsbFRva2VucywgYWxsR3JvdXBzKSA6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLmZvbnRTaXplLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXHJcbiAgICAgICAgICAgIGZvbnRXZWlnaHQ6IHJlcHJlc2VudEZvbnRXZWlnaHRUb2tlblZhbHVlKHZhbHVlLmZvbnQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcclxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUubGV0dGVyU3BhY2luZywgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxyXG4gICAgICAgICAgICBsaW5lSGVpZ2h0OiB2YWx1ZS5saW5lSGVpZ2h0XHJcbiAgICAgICAgICAgICAgICA/ICgndGV4dCcgaW4gdmFsdWUubGluZUhlaWdodCA/IHJlcHJlc2VudEdlbmVyaWNUb2tlblZhbHVlKHZhbHVlLmxpbmVIZWlnaHQsIGFsbFRva2VucywgYWxsR3JvdXBzKSA6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLmxpbmVIZWlnaHQsIGFsbFRva2VucywgYWxsR3JvdXBzKSlcclxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbi8qKiBSZXByZXNlbnQgYm9yZGVyIHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cclxuZnVuY3Rpb24gcmVwcmVzZW50Qm9yZGVyVG9rZW5WYWx1ZSh2YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcclxuICAgIGxldCByZXN1bHQ7XHJcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XHJcbiAgICAgICAgLy8gRm9ybXMgcmVmZXJlbmNlXHJcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBSYXcgdmFsdWVcclxuICAgICAgICByZXN1bHQgPSB7XHJcbiAgICAgICAgICAgIGNvbG9yOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50Q29sb3JUb2tlblZhbHVlKHZhbHVlLmNvbG9yLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHdpZHRoOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcclxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS53aWR0aCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5wb3NpdGlvbixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG4vKiogUmVwcmVzZW50IHNoYWRvdyB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXHJcbmZ1bmN0aW9uIHJlcHJlc2VudFNoYWRvd1Rva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XHJcbiAgICBsZXQgcmVzdWx0O1xyXG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xyXG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxyXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gUmF3IHZhbHVlXHJcbiAgICAgICAgcmVzdWx0ID0ge1xyXG4gICAgICAgICAgICBjb2xvcjogcmVwcmVzZW50Q29sb3JUb2tlblZhbHVlKHZhbHVlLmNvbG9yLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXHJcbiAgICAgICAgICAgIG9mZnNldFg6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLngsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcclxuICAgICAgICAgICAgb2Zmc2V0WTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUueSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxyXG4gICAgICAgICAgICBibHVyOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5yYWRpdXMsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcclxuICAgICAgICAgICAgc3ByZWFkOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5zcHJlYWQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG4vKiogUmVwcmVzZW50IGdyYWRpZW50IHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cclxuZnVuY3Rpb24gcmVwcmVzZW50R3JhZGllbnRUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xyXG4gICAgbGV0IHJlc3VsdDtcclxuICAgIGlmICh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4pIHtcclxuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcclxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIFJhdyB2YWx1ZVxyXG4gICAgICAgIHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgdG86IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9pbnRcIixcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgeDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNpemVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLnRvLngsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUudG8ueSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnJvbToge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb2ludFwiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgICAgICAgICAgICB4OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUuZnJvbS54LFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNpemVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLmZyb20ueSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHlwZToge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS50eXBlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhc3BlY3RSYXRpbzoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUuYXNwZWN0UmF0aW8sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0b3BzOiB7fSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIEluamVjdCBncmFkaWVudCBzdG9wc1xyXG4gICAgICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgc3RvcCBvZiB2YWx1ZS5zdG9wcykge1xyXG4gICAgICAgICAgICBsZXQgc3RvcE9iamVjdCA9IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiZ3JhZGllbnRTdG9wXCIsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBzdG9wLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJjb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRDb2xvclRva2VuVmFsdWUoc3RvcC5jb2xvciwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmVzdWx0LnN0b3BzW2Ake2NvdW50fWBdID0gc3RvcE9iamVjdDtcclxuICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cclxuLy8gTUFSSzogLSBPYmplY3Qgd3JhcHBlcnNcclxuLyoqIFJldHJpZXZlIHdyYXBwZXIgdG8gY2VydGFpbiB0b2tlbiAocmVmZXJlbmNlZCBieSBuYW1lKSBwb2ludGluZyB0byB0b2tlbiB2YWx1ZSAqL1xyXG5mdW5jdGlvbiByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZSkge1xyXG4gICAgcmV0dXJuIGB7JHtyZWZlcmVuY2V9fWA7XHJcbn1cclxuLyoqIFJldHJpZXZlIHRva2VuIHdyYXBwZXIgY29udGFpbmluZyBpdHMgbWV0YWRhdGEgYW5kIHZhbHVlIGluZm9ybWF0aW9uICh1c2VkIGFzIGNvbnRhaW5lciBmb3IgZWFjaCBkZWZpbmVkIHRva2VuKSAqL1xyXG5mdW5jdGlvbiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIFwiJHZhbHVlXCI6IHZhbHVlLFxyXG4gICAgICAgIFwiJHR5cGVcIjogdHlwZUxhYmVsKHRva2VuLnRva2VuVHlwZSksXHJcbiAgICAgICAgXCIkZGVzY3JpcHRpb25cIjogdG9rZW4uZGVzY3JpcHRpb24ubGVuZ3RoID4gMCA/IHRva2VuLmRlc2NyaXB0aW9uIDogdW5kZWZpbmVkLFxyXG4gICAgICAgIFwiJGV4dGVuc2lvbnNcIjoge1xyXG4gICAgICAgICAgICBcIm9yZy5zdXBlcm5vdmEtaW9cIjoge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0b2tlbi5pZCxcclxuICAgICAgICAgICAgICAgIFwiZmlnbWEtc3R5bGUta2V5XCI6IHRva2VuLm9yaWdpbiA/IChfYSA9IHRva2VuLm9yaWdpbi5pZCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNsaWNlKDIsIC0xKSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIFwibWV0YWRhdGFcIjogT2JqZWN0LmtleXModG9rZW4ucHJvcGVydHlWYWx1ZXMpLmxlbmd0aCA+IDAgPyB0b2tlbi5wcm9wZXJ0eVZhbHVlcyA6IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG4vLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXHJcbi8vIE1BUks6IC0gTmFtaW5nXHJcbi8qKiBDcmVhdGUgZnVsbCByZWZlcmVuY2UgbmFtZSByZXByZXNlbnRpbmcgdG9rZW4uIFN1Y2ggbmFtZSBjYW4sIGZvciBleGFtcGxlLCBsb29rIGxpa2U6IFtnMV0uW2cyXS5bZzNdLltnNF0uW3Rva2VuLW5hbWVdICovXHJcbmZ1bmN0aW9uIHJlZmVyZW5jZU5hbWUodG9rZW4sIGFsbEdyb3Vwcykge1xyXG4gICAgLy8gRmluZCB0aGUgZ3JvdXAgdG8gd2hpY2ggdG9rZW4gYmVsb25ncy4gVGhpcyBpcyByZWFsbHkgc3Vib3B0aW1hbCBhbmQgc2hvdWxkIGJlIHNvbHZlZCBieSB0aGUgU0RLIHRvIGp1c3QgcHJvdmlkZSB0aGUgZ3JvdXAgcmVmZXJlbmNlXHJcbiAgICBsZXQgb2NjdXJhbmNlcyA9IGFsbEdyb3Vwcy5maWx0ZXIoKGcpID0+IGcudG9rZW5JZHMuaW5kZXhPZih0b2tlbi5pZCkgIT09IC0xKTtcclxuICAgIGlmIChvY2N1cmFuY2VzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHRocm93IEVycm9yKFwiSlM6IFVuYWJsZSB0byBmaW5kIHRva2VuIGluIGFueSBvZiB0aGUgZ3JvdXBzXCIpO1xyXG4gICAgfVxyXG4gICAgbGV0IGNvbnRhaW5pbmdHcm91cCA9IG9jY3VyYW5jZXNbMF07XHJcbiAgICBsZXQgdG9rZW5QYXJ0ID0gc2FmZVRva2VuTmFtZSh0b2tlbik7XHJcbiAgICBsZXQgZ3JvdXBQYXJ0cyA9IHJlZmVyZW5jZUdyb3VwQ2hhaW4oY29udGFpbmluZ0dyb3VwKS5tYXAoKGcpID0+IHNhZmVHcm91cE5hbWUoZykpO1xyXG4gICAgcmV0dXJuIFsuLi5ncm91cFBhcnRzLCB0b2tlblBhcnRdLmpvaW4oXCIuXCIpO1xyXG59XHJcbi8qKiBSZXRyaWV2ZSBzYWZlIHRva2VuIG5hbWUgbWFkZSBvdXQgb2Ygbm9ybWFsIHRva2VuIG5hbWVcclxuICogVGhpcyByZXBsYWNlIHNwYWNlcyB3aXRoIGRhc2hlcywgYWxzbyBjaGFuZ2UgYW55dGhpbmcgbm9uLWFscGhhbnVtZXJpYyBjaGFyIHRvIGl0IGFzIHdlbGwuXHJcbiAqIEZvciBleGFtcGxlLCBTVCZSSyBJbmR1c3RyaWVzIHdpbGwgYmUgY2hhbmdlZCB0byBzdC1yay1pbmR1c3RyaWVzXHJcbiAqL1xyXG5mdW5jdGlvbiBzYWZlVG9rZW5OYW1lKHRva2VuKSB7XHJcbiAgICByZXR1cm4gdG9rZW4ubmFtZS50cmltKCkucmVwbGFjZSgvXFxXKy9nLCBcIi1cIikudG9Mb3dlckNhc2UoKTtcclxufVxyXG4vKiogUmV0cmlldmUgc2FmZSBncm91cCBuYW1lIG1hZGUgb3V0IG9mIG5vcm1hbCBncm91cCBuYW1lXHJcbiAqIFRoaXMgcmVwbGFjZSBzcGFjZXMgd2l0aCBkYXNoZXMsIGFsc28gY2hhbmdlIGFueXRoaW5nIG5vbi1hbHBoYW51bWVyaWMgY2hhciB0byBpdCBhcyB3ZWxsLlxyXG4gKiBGb3IgZXhhbXBsZSwgU1QmUksgSW5kdXN0cmllcyB3aWxsIGJlIGNoYW5nZWQgdG8gc3QtcmstaW5kdXN0cmllc1xyXG4gKi9cclxuZnVuY3Rpb24gc2FmZUdyb3VwTmFtZShncm91cCkge1xyXG4gICAgcmV0dXJuIGdyb3VwLm5hbWUucmVwbGFjZSgvXFxXKy9nLCBcIi1cIikudG9Mb3dlckNhc2UoKTtcclxufVxyXG4vKiogUmV0cmlldmUgaHVtYW4tcmVhZGFibGUgdG9rZW4gdHlwZSBpbiB1bmlmaWVkIGZhc2hpb24sIHVzZWQgYm90aCBhcyB0b2tlbiB0eXBlIGFuZCBhcyB0b2tlbiBtYXN0ZXIgZ3JvdXAgKi9cclxuZnVuY3Rpb24gdHlwZUxhYmVsKHR5cGUpIHtcclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgIGNhc2UgXCJCb3JkZXJcIjpcclxuICAgICAgICAgICAgcmV0dXJuIFwiYm9yZGVyXCI7XHJcbiAgICAgICAgY2FzZSBcIkNvbG9yXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBcImNvbG9yXCI7XHJcbiAgICAgICAgY2FzZSBcIkZvbnRcIjpcclxuICAgICAgICAgICAgcmV0dXJuIFwiZm9udFwiO1xyXG4gICAgICAgIGNhc2UgXCJHZW5lcmljVG9rZW5cIjpcclxuICAgICAgICAgICAgcmV0dXJuIFwiZ2VuZXJpY1wiO1xyXG4gICAgICAgIGNhc2UgXCJHcmFkaWVudFwiOlxyXG4gICAgICAgICAgICByZXR1cm4gXCJncmFkaWVudFwiO1xyXG4gICAgICAgIGNhc2UgXCJNZWFzdXJlXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBcIm1lYXN1cmVcIjtcclxuICAgICAgICBjYXNlIFwiUmFkaXVzXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBcInJhZGl1c1wiO1xyXG4gICAgICAgIGNhc2UgXCJTaGFkb3dcIjpcclxuICAgICAgICAgICAgcmV0dXJuIFwic2hhZG93XCI7XHJcbiAgICAgICAgY2FzZSBcIlRleHRcIjpcclxuICAgICAgICAgICAgcmV0dXJuIFwidGV4dFwiO1xyXG4gICAgICAgIGNhc2UgXCJUeXBvZ3JhcGh5XCI6XHJcbiAgICAgICAgICAgIHJldHVybiBcInR5cG9ncmFwaHlcIjtcclxuICAgIH1cclxufVxyXG4vLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXHJcbi8vIE1BUks6IC0gTG9va3VwXHJcbi8qKiBGaW5kIGFsbCB0b2tlbnMgdGhhdCBiZWxvbmcgdG8gYSBjZXJ0YWluIGdyb3VwIGFuZCByZXRyaWV2ZSB0aGVtIGFzIG9iamVjdHMgKi9cclxuZnVuY3Rpb24gdG9rZW5zT2ZHcm91cChjb250YWluaW5nR3JvdXAsIGFsbFRva2Vucykge1xyXG4gICAgcmV0dXJuIGFsbFRva2Vucy5maWx0ZXIoKHQpID0+IGNvbnRhaW5pbmdHcm91cC50b2tlbklkcy5pbmRleE9mKHQuaWQpICE9PSAtMSk7XHJcbn1cclxuLyoqIFJldHJpZXZlIGNoYWluIG9mIGdyb3VwcyB1cCB0byBhIHNwZWNpZmllZCBncm91cCwgb3JkZXJlZCBmcm9tIHBhcmVudCB0byBjaGlsZHJlbiAqL1xyXG5mdW5jdGlvbiByZWZlcmVuY2VHcm91cENoYWluKGNvbnRhaW5pbmdHcm91cCkge1xyXG4gICAgbGV0IGl0ZXJhdGVkR3JvdXAgPSBjb250YWluaW5nR3JvdXA7XHJcbiAgICBsZXQgY2hhaW4gPSBbY29udGFpbmluZ0dyb3VwXTtcclxuICAgIHdoaWxlIChpdGVyYXRlZEdyb3VwLnBhcmVudCkge1xyXG4gICAgICAgIGNoYWluLnB1c2goaXRlcmF0ZWRHcm91cC5wYXJlbnQpO1xyXG4gICAgICAgIGl0ZXJhdGVkR3JvdXAgPSBpdGVyYXRlZEdyb3VwLnBhcmVudDtcclxuICAgIH1cclxuICAgIHJldHVybiBjaGFpbi5yZXZlcnNlKCk7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==