module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    rules: {
        indent: ["error", 4],
        "no-console": "off",
        "no-undef": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        //定义了必须使用
        "@typescript-eslint/no-unused-vars": "off",
        //不能为any
        "@typescript-eslint/no-explicit-any": "off",
        //不能用require，因为TS本身不能动态加载模块
        "@typescript-eslint/no-var-requires": "off",
    },
};
