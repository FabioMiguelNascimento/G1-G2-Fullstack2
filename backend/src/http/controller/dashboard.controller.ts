import { NextFunction, Request, Response } from "express";
import DashboardRepository from "../repository/dashboard.repo.js";
import DashboardResponse from "../views/dashboard.view.js";

export default class DashboardController {
    private repo: DashboardRepository;
    private view: DashboardResponse;

    constructor() {
        this.repo = new DashboardRepository();
        this.view = new DashboardResponse();
    }

    getStats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stats = await this.repo.getDashboardStats();

            res.status(200).json(this.view.getStats(stats));
        } catch (error) {
            next(error);
        }
    }
}