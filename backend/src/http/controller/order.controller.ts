import { NextFunction, Request, Response } from "express";
import OrderRepository from "../repository/order.repo.js";
import OrderView from "../views/order.view.js";

export default class OrderController {
    private repo: OrderRepository;
    private view: OrderView;

    constructor() {
        this.repo = new OrderRepository();
        this.view = new OrderView();
    }

    getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId;
            const orders = await this.repo.getUserOrders(userId);
            res.status(200).json(this.view.getUserOrders(orders));
        } catch (err) {
            next(err);
        }
    }
}