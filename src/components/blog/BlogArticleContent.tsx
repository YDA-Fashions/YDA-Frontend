import { prepareBlogHtml } from "@/lib/blogContent";

type Props = {
  content: string;
  stripTitleFromBody?: boolean;
};

export default function BlogArticleContent({
  content,
  stripTitleFromBody = true,
}: Props) {
  if (!content) {
    return (
      <p className="text-lg text-black/60 font-sans leading-relaxed italic">
        This article is being prepared. Please check back soon.
      </p>
    );
  }

  if (!content.includes("<")) {
    return (
      <div className="blog-article space-y-6">
        {content.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            className="text-lg text-black/80 font-sans leading-[1.85]"
          >
            {paragraph}
          </p>
        ))}
      </div>
    );
  }

  const html = prepareBlogHtml(content, { stripLeadingH1: stripTitleFromBody });

  return (
    <div
      className="blog-article prose prose-stone prose-lg max-w-none
                 prose-headings:font-serif prose-headings:font-normal prose-headings:text-black
                 prose-p:font-sans prose-p:leading-[1.85] prose-p:text-black/80
                 prose-a:text-black prose-a:underline-offset-4 hover:prose-a:text-black/60
                 prose-strong:text-black prose-strong:font-semibold
                 prose-img:my-8 prose-img:rounded-md"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
