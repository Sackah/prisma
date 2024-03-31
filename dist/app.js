import express from "express";
import { PrismaClient } from "@prisma/client";
import { validate } from "./helpers.js";
const prisma = new PrismaClient();
async function main() {
    const app = express();
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
    app.use(express.json());
    app.post("/user", async (req, res) => {
        const { user } = req.body;
        if (user && validate(["name", "email"], user)) {
            try {
                // Perform database operation
                // const createdUser = await prisma.user.create({ data: user });
                const newUser = await prisma.user.create({
                    data: {
                        name: user.name,
                        email: user.email,
                    },
                });
                res.status(200).send({
                    message: "User created successfully",
                    user: newUser,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).send({
                    message: "An error occurred while creating the user",
                });
            }
        }
        else {
            res.status(400).send({
                message: "Incorect user data provided",
            });
        }
    });
    app.get("/users", async (req, res) => {
        const users = await prisma.user.findMany();
        res.send(users);
    });
    app.patch("/user/:id", async (req, res) => {
        const { id } = req.params;
        const { user } = req.body;
        if (!user) {
            return res.status(400).send({
                message: "Invalid user field",
            });
        }
        try {
            const updatedUser = await prisma.user.update({
                where: {
                    id: Number(id),
                },
                data: user,
            });
            res.status(200).send(updatedUser);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({
                message: "segmentation fault 😑",
            });
        }
    });
    app.post("/article/:id", async (req, res) => {
        const { id } = req.params;
        const { article } = req.body;
        if (id && validate(["title", "body"], article)) {
            try {
                const newArticle = await prisma.article.create({
                    data: {
                        ...article,
                        author: {
                            connect: {
                                id: Number(id),
                            },
                        },
                    },
                });
                res.status(200).send({
                    article: newArticle,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).send({
                    message: "Failed to create article from my side dawg, my bad",
                });
            }
        }
        else {
            res.status(400).send({
                message: "Article field is invalid",
            });
        }
    });
    app.get("/articles", async (req, res) => {
        try {
            const articles = await prisma.article.findMany();
            res.status(200).send(articles);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({
                message: "segmentation fault 😑",
            });
        }
    });
    app.get("/articles/:userId", async (req, res) => {
        const { userId } = req.params;
        const user = await prisma.user.findFirst({
            where: {
                id: Number(userId),
            },
            include: {
                articles: true,
            },
        });
        if (user) {
            res.send(user.articles);
        }
        else {
            res.status(400).send({
                message: `No user found with that id`,
            });
        }
    });
    app.delete("/article/:id", async (req, res) => {
        const { id } = req.params;
        try {
            const article = await prisma.article.delete({
                where: {
                    id: Number(id),
                },
            });
            res.status(200).send(article);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({
                message: "segmentation fault 😑",
            });
        }
    });
    app.post("/multiroute", async (req, res) => {
        const { user, article } = req.body;
        if (!validate(["name", "email"], user)) {
            return res.status(400).send({
                message: "Invalid user field",
            });
        }
        if (!validate(["title", "body"], article)) {
            return res.status(400).send({
                message: "Invalid user field",
            });
        }
        try {
            const data = await prisma.user.create({
                data: {
                    ...user,
                    articles: {
                        create: article,
                    },
                },
            });
            res.status(200).send(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({
                message: "segmentation fault 😑",
            });
        }
    });
    app.get("/users-articles", async (req, res) => {
        try {
            const userWithArticles = await prisma.user.findMany({
                include: {
                    articles: true,
                },
            });
            res.status(200).send(userWithArticles);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({
                message: "segmentation fault 😑",
            });
        }
    });
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit();
});
//# sourceMappingURL=app.js.map