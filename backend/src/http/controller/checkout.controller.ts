import { CheckoutInput } from "@/schema/checkout.schema.js";
import { NextFunction, Request, Response } from "express";
import CheckoutRepository from "../repository/checkout.repo.js";
import CheckoutView from "../views/checkout.view.js";

export default class CheckoutController {
    private repo: CheckoutRepository;
    private view: CheckoutView;

    constructor() {
        this.repo = new CheckoutRepository();
        this.view = new CheckoutView();
    }

    checkout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { password }: CheckoutInput = req.validatedData;
            const userId = req.userId;

            const order = await this.repo.checkout(userId, password);

            res.status(200).json(this.view.checkout(order));
        } catch (err) {
            next(err);
        }
    }
}