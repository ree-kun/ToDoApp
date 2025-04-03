import { booleanArg, idArg, makeSchema, mutationType, nonNull, objectType, queryType, stringArg } from "nexus";
import path from "path";

const Query = queryType({
  definition(t) {
    t.nonNull.list.field("getTodos", {
      description: "TODO一覧取得",
      type: Todo,
      async resolve(_parent, _args, context) {
          await new Promise(resolve => setTimeout(resolve, 500))
        return context.prisma.todo.findMany();
      }
    })
  },
});

const Mutation = mutationType({
  definition(t) {
    t.field("addTodo", {
      description: "TODO追加",
      args: { title: nonNull(stringArg()) },
      type: "Todo",
      resolve(_parent, args, context) {
        return context.prisma.todo.create({
          data: {
            title: args.title,
            completed: false,
          },
        });
      }
    })
    t.field("updateTodo", {
      description: "TODO更新",
      args: {
        id: nonNull(idArg()),
        completed: nonNull(booleanArg()),
      },
      type: "Todo",
      resolve(_parent, args, context) {
        return context.prisma.todo.update({
          where: { id: args.id },
          data: { completed: args.completed },
        });
      }
    })
    t.field("deleteTodo", {
      description: "TODO削除",
      args: { id: nonNull(idArg()) },
      type: "Todo",
      resolve(_parent, args, context) {
        return context.prisma.todo.delete({
          where: { id: args.id },
        });
      }
    })
  }
})

const Todo = objectType({
  name: "Todo",
  description: "Todoの型定義",
  definition(t) {
    t.nonNull.id("id", { description: "ID" });
    t.nonNull.string("title", { description: "タイトル" });
    t.nonNull.boolean("completed", { description: "完了フラグ" });
  }
})

export const schema = makeSchema({
  types: [Query, Mutation, Todo],
  outputs: {
    typegen: path.join(process.cwd(), "generated", "nexus-typegen.ts"),
    schema: path.join(process.cwd(), "generated", "schema.graphql"),
  },
  contextType: {
    module: path.join(process.cwd(), "src", "graphql", "context.ts"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
});
