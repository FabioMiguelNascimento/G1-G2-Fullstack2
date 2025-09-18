-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductInCart" (
    "productId" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    PRIMARY KEY ("productId", "cartId"),
    CONSTRAINT "ProductInCart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductInCart_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductInCart" ("assignedAt", "assignedBy", "cartId", "productId") SELECT "assignedAt", "assignedBy", "cartId", "productId" FROM "ProductInCart";
DROP TABLE "ProductInCart";
ALTER TABLE "new_ProductInCart" RENAME TO "ProductInCart";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
