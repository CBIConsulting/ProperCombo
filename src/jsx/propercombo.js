import ComboField from "./components/combofield";

if (process.env.APP_ENV === 'browser-env') {
	require("../css/style.scss");
}

export default ComboField;
