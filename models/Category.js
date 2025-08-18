class Category {
  constructor({ id, name, icon, background, type }) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.background = background;
    this.type = type; // "income" or "expense"
  }
}

export default Category;
