import { join } from "path";
import fs from "fs";
import { serialize } from "next-mdx-remote/serialize";
import { remarkCodeHike } from "@code-hike/mdx";

/**
 * Get template from /src/lib/markdown/template and generate code-block
 * with code-hike and rose-pine-moon theme
 */

export const getTemplateCodeBlockMdx = async (
  templateName: string,
  match: string,
  value: string
) => {
  try {
    const templatePath = join(
      process.cwd(),
      "src",
      "lib",
      "markdown",
      "template",
      templateName
    );

    const theme = JSON.parse(
      fs.readFileSync(
        join(process.cwd(), "src", "styles", "rose-pine-moon.json"),
        { encoding: "utf-8" }
      )
    );

    const template = fs.readFileSync(templatePath, { encoding: "utf-8" });
    const codeStr = template.replaceAll(match, value);

    const templateSource = await serialize(codeStr, {
      mdxOptions: {
        remarkPlugins: [[remarkCodeHike, { autoImport: false, theme }]],
        useDynamicImport: true,
      },
    });

    return Promise.resolve(templateSource);
  } catch (err) {
    return Promise.reject(err);
  }
};