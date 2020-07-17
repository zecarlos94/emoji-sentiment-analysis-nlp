export default class Emoji {
    constructor(route, name, description, aliases, shortcodes, emojiIcon) {
      this.route = route;
      this.name = name;
      this.description = description;
      this.aliases = aliases;
      this.shortcodes = shortcodes;
      this.emojiIcon = emojiIcon;
    }

    getRoute() {
      return this.route;
    }

    getName() {
      return this.name;
    }
  
    getDescription() {
      return this.description;
    }

    getAliases() {
      return this.aliases;
    }

    getShortcodes() {
      return this.shortcodes;
    }

    getEmojiIcon() {
      return this.emojiIcon;
    }

    setRoute(newRoute) {
      this.route = newRoute;
    }

    setName(newName) {
      this.name = newName;
    }
  
    setDescription(newDescription) {
      this.description = newDescription;
    }

    setAliases(newAliases) {
      this.aliases = newAliases;
    }

    setShortcodes(newShortcodes) {
      this.shortcodes = newShortcodes;
    }

    setEmojiIcon(newEmojiIcon) {
      this.emojiIcon = newEmojiIcon;
    }
}