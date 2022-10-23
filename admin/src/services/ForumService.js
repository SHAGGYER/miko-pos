export class ForumService {
  constructor(props) {
    this.fora = props.fora;
  }

  parseForums() {
    let forums = []

    this.fora.forEach((forum) => {
      if (forum.parentId === null) {
        forums.push({
          ...forum,
          title: forum.title,
        });
        this.findChildren(this.fora, forum, [], 1, forums);
      }
    });

    return forums;
  }

  findChildren(fora, forum, children, level, toAddForums) {
    const forums = fora.filter(f => f.parentId === forum.id);
    if (!forums.length) {
      return;
    }

    let text = ""
    for (let i = 0; i < level; i++) {
      text += "--"
    }

    forums.forEach((child) => {
      if (child.parentId) {
        toAddForums.push({
          ...child,
          text: text + child.title
        });
        this.findChildren(fora, child, toAddForums, level + 1, toAddForums);
      } else {
        toAddForums.push({
          ...child,
          text: text + child.title
        });
      }
    });
  }

}