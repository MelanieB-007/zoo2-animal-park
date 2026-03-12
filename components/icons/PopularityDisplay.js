import NextImage from "next/image";

export default function PopularityDisplay({popularity, translation}) {
  return (
    <PopularityDisplay>
        {popularity}
        <NextImage src="/images/icons/besucher.jpg" alt={translation.popularity} />
    </PopularityDisplay>
  );
}