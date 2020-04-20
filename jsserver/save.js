"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var mongoose = require("mongoose");
var validator_1 = require("validator");
var Error = require("./error");
var uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fifa';
var mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose.connect(uri, mongooseOptions, function (err) {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("Save Successfully Connected!");
    }
});
;
var SaveSchema = new mongoose.Schema({
    jid: { type: String, required: true },
    user: { type: String, required: true },
    shared: { type: Boolean, required: false },
    name: { type: String, required: true },
    managerName: { type: String, required: true },
    date: { type: Date, required: true },
    game: { type: String, required: true },
    doc: { type: Date, required: true },
    dom: { type: Date, required: true }
});
exports.Save = mongoose.model("Save", SaveSchema);
exports.save = function (req, res) {
    var saveObject = validateSave(req.body);
    saveObject.dom = new Date();
    var save = new exports.Save(saveObject);
    save.save(function (err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            res.send(save);
        }
    });
};
function findByKey(jid) {
    return __awaiter(this, void 0, void 0, function () {
        var save;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.Save.find({ jid: jid })];
                case 1:
                    save = _a.sent();
                    return [2 /*return*/, Error.CheckKeyResult(save, "Save")];
            }
        });
    });
}
exports.findByKey = findByKey;
;
function findAllByUser(user) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.Save.find({ user: user })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.findAllByUser = findAllByUser;
function deleteByKey(user, jid) {
    return __awaiter(this, void 0, void 0, function () {
        var save;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findByKey(jid)];
                case 1:
                    save = _a.sent();
                    if (!(user == save.user)) return [3 /*break*/, 3];
                    return [4 /*yield*/, exports.Save.deleteOne({ jid: jid })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3: throw "Cannot delete game for different user";
            }
        });
    });
}
exports.deleteByKey = deleteByKey;
var validateSave = function (save) {
    save.user = validator_1.escape(save.user);
    save.name = validator_1.escape(save.name);
    save.managerName = validator_1.escape(save.managerName);
    save.game = validator_1.escape(save.game);
    save.dom = new Date(parseInt(save.dom));
    save.doc = new Date(parseInt(save.doc));
    save.date = new Date(parseInt(save.date));
    save.shared = (save.shared == "true");
    if (save.dom < save.doc) {
        save.dom = save.doc;
    }
    return save;
};
function findAllByUserName(user, name) {
    return __awaiter(this, void 0, void 0, function () {
        var saves;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.Save.find({ user: user, name: name })];
                case 1:
                    saves = _a.sent();
                    return [2 /*return*/, saves];
            }
        });
    });
}
exports.findAllByUserName = findAllByUserName;
