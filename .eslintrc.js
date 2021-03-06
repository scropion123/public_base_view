module.exports = {
	"root": true,
	"env": {
		"node": true
	},
	"extends": [
		// vue项目打开此行注释
		"plugin:vue/recommended",
		"eslint:recommended"
	],
	"rules": {
		// 允许console
		"no-console": "off",
		// 允许空语句块
		"no-empty": ["error", { "allowEmptyCatch": true }],
		// 强制关键字周围空格的一致性 (keyword-spacing)
		"keyword-spacing": "error",
		// 把 var 语句看作是在块级作用域范围之内
		"block-scoped-var": "error",
		// 要求遵循大括号约定
		"curly": "error",
		// switch 要有default分支
		"default-case": "error",
		// no-eq-null 禁止与null进行比较
		"no-eq-null": "error",
		// 禁止使用多个空格
		"no-multi-spaces": ["error", {"exceptions": { "Property": true }}],
		// 禁止多行字符串
		"no-multi-str": "error",
		// 禁止使用 new 以避免产生副作用
		"no-new": "error",
		// 数组中的空格
		"array-bracket-spacing": ["error", "never"],
		// 禁止或强制在代码块中开括号前和闭括号后有空格
		"block-spacing": "error",
		// 大括号风格要求
		"brace-style": ["error",  "1tbs", { "allowSingleLine": true }],
		// 逗号前后使用一致的空格
		"comma-spacing": ["error", { "before": false, "after": true }],
		// 逗号风格
		"comma-style": ["error", "last"],
		// 计算属性不使用空格
		"computed-property-spacing": ["error", "never"],
		// 函数标识符和其调用之间禁止空格
		"func-call-spacing": ["error", "never"],
		// 箭头函数函数体的位置
		"implicit-arrow-linebreak": ["error", "beside"],
		// tab缩进
		"indent": ["error", "tab", { "SwitchCase": 1 }],
		// 对象key-value空格
		"key-spacing": ["error", { "beforeColon": false }],
		// 行注释位置
		"line-comment-position": ["error", { "position": "above" }],
		// 换行符风格
		// "linebreak-style": ["error", "unix"],
		// 类成员之间需要空行
		"lines-between-class-members": ["error", "always"],
		// 要求构造函数首字母大写
		"new-cap": "error",
		// 调用无参构造函数时带括号
		"new-parens": "error",
		// 禁止使用 Array 构造函数
		"no-array-constructor": "error",
		// 禁止使用内联注释
		"no-inline-comments": "error",
		// 禁止连续赋值
		"no-multi-assign": "error",
		// 不允许多个空行
		"no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1 }],
		// 禁止使用 Object 构造函数
		"no-new-object": "error",
		// 禁用行尾空白
		"no-trailing-spaces": "error",
		// 禁止属性前有空白
		"no-whitespace-before-property": "error",
		// 强制在花括号内使用一致的换行符
		"object-curly-newline": ["error", { "ImportDeclaration": "always", "ExportDeclaration": "always" }],
		// 花括号中使用一致的空格
		"object-curly-spacing": ["error", "never"],
		// 要求在变量声明周围换行
		"one-var-declaration-per-line": ["error", "always"],
		// 禁止块内填充
		"padded-blocks": ["error", "never"],
		// 语句间填充空行
		"padding-line-between-statements": [
			"error",
			{ blankLine: "always", prev: ["const", "let", "var"], next: "*"},
			{ blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"]},
			{ blankLine: "always", prev: "directive", next: "*" },
			{ blankLine: "any", prev: "directive", next: "directive" }
		],
		// 对象字面量属性名称使用引号
		"quote-props": ["error", "as-needed"],
		// 强制使用一致的反勾号、双引号或单引号
		"quotes": "error",
		// 行尾分号
		"semi": ["error", "always"],
		// 分号前后空格
		"semi-spacing": ["error", {"before": false, "after": true}],
		// 分号位置
		"semi-style": ["error", "last"],
		// 语句块之前的空格
		"space-before-blocks": "error",
		// function空格
		"space-before-function-paren": ["error", {
			"anonymous": "always",
			"named": "never",
			"asyncArrow": "always"
		}],
		// 禁止圆括号内的空格
		"space-in-parens": "error",
		// 要求中缀操作符周围有空格
		"space-infix-ops": "error",
		// 要求或禁止在一元操作符之前或之后存在空格
		"space-unary-ops": ["error", {"words": true, "nonwords": false}],
		// 要求或禁止在注释前有空白
		"spaced-comment": ["error", "always"],
		// 强制在 switch 的冒号左右有空格
		"switch-colon-spacing": "error",
		// 要求正则表达式被包裹起来
		"wrap-regex": "error",
		// ES6
		// 要求箭头函数体使用大括号
		"arrow-body-style": "error",
		// 要求箭头函数的箭头之前或之后有空格
		"arrow-spacing": "error",
		// 禁止重复导入
		"no-duplicate-imports": "error",
		// html
		"vue/html-indent": ["error", "tab"]
	},
	"parserOptions": {
		"parser": "babel-eslint"
	}
}
