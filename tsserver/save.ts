import * as mongoose from "mongoose";
import { escape } from "validator";
import { Request } from 'express';
import { Response } from 'express';
import * as Error from './error';

const uri: string = 
    process.env.MONGODB_URI || 'mongodb://localhost:27017/fifa';

var mongooseOptions = { 
    useNewUrlParser: true,
    useUnifiedTopology: true }
mongoose.connect(uri, mongooseOptions, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Save Successfully Connected!");
    }
});

export interface ISave extends mongoose.Document {
    jid: string;
    user: string;
    shared: boolean;
    name: string;
    managerName: string;
    date: Date;
    game: string;
    doc: Date;
    dom: Date;
};

const SaveSchema = new mongoose.Schema({
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

export const Save = mongoose.model<ISave>("Save", SaveSchema);

export let save = (req: Request, res: Response) => {
    var saveObject: ISave = validateSave(req.body);
    saveObject.dom = new Date();
    
    var save = new Save(saveObject);

    save.save((err: any) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(save);
        }
    });
};

export async function findByKey(jid: string) {
    let save = await Save.find( { jid: jid });
    return Error.CheckKeyResult(save, "Save");
};

export async function findAllByUser(user: string) {
    return await Save.find({ user: user });
}

export async function deleteByKey(user: string, jid: string) {
    let save:ISave = await findByKey(jid);
    if (user == save.user) {
        await Save.deleteOne({ jid: jid });
        return true;
    } else
        throw "Cannot delete game for different user";
}

var validateSave = (save: any) => {
    save.user = escape(save.user);
    save.name = escape(save.name);
    save.managerName = escape(save.managerName);
    save.game = escape(save.game);
    save.dom = new Date(parseInt(save.dom));
    save.doc = new Date(parseInt(save.doc));
    save.date = new Date(parseInt(save.date));
    save.shared = (save.shared == "true");
    if (save.dom < save.doc) {
        save.dom = save.doc;
    }
    return save;
}

export async function findAllByUserName(user: string, name: string) {
    let saves = await Save.find({ user: user, name: name });
    return saves;
}