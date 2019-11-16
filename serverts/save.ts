import * as mongoose from "mongoose";
import { escape } from "validator";
import { Request } from 'express';
import { Response } from 'express';

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
    user: { type: String, required: true },
    shared: { type: Boolean, required: true },
    name: { type: String, required: true },
    managerName: { type: String, required: true },
    date: { type: Date, required: true },
    game: { type: String, required: true },
    doc: { type: Date, required: true },
    dom: { type: Date, required: true }
});

export const Save = mongoose.model<ISave>("Save", SaveSchema);

export let save = (req: Request, res: Response) => {
    console.log(req.body);
    var saveObject: ISave = validateSave(req.body);
    console.log(saveObject);
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

export let getSave = (req: Request, res: Response) => {
    let save = Save.findById(req.query.id, (err: any, save: any) => {
        if (err) {
            res.send({ success: false, error: err });
        } else {
            res.send({ success: true, save: save });
        }
    });
};

export let getSaves = (req: Request, res: Response) => {
    console.log(req.query);
    Save.find({ user: req.query.user }, (err: any, saves: ISave[]) => {
        if (err) {
            res.send({ error: err });
        } else {
            res.send(saves);
        }
    });
};

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