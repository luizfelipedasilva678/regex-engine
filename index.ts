import Regex from "./src/regex";
const regex = new Regex();

regex.test("a(b|c)+d", "aaaa");
