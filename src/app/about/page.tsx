import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const members = [
  {
    name: "Ivan Kuts",
    photo: "/ivan.jpg",
    role: "Team Lead, Full-stack, Back-end, Front-end",
    linked: "https://www.linkedin.com/in/ivan-kuts-a52114199/",
  },
  {
    name: "Kryvokhata Mariia",
    photo: "/maria.jpg",
    role: "Designer, Product manager, Data analyst",
    linked: "https://www.linkedin.com/in/mariia-kryvokhata/",
  },
];

const atricles = [
  {
    title: "What does our app do?",
    description:
      "SkyGuard is an interactive platform that brings space science to life by visualizing real asteroid impact scenarios using NASA data. Users can explore how asteroids travel through space, simulate what would happen if it one struck Earth, and see the potential effects — crater formation, seismic effects, and atmospheric changes.\n\n" +
      "The tool lets users adjust variables such as asteroid density, impact angle, and distance from impact center, then instantly see how those changes alter outcomes. By combining scientific accuracy with intuitive design, dynamic visuals, and explanatory tooltips, the platform turns complex impact modeling into an accessible experience. It empowers the public, educators, and decision-makers to better understand asteroid threats and explore possible ways to protect our planet.\n" +
      '<a target="_blank" class="text-purple-700 underline" href="https://github.com/kujo205/nasa-space-hackakon-2025">Project github link<a/>' +
      '<a target="_blank" class="text-purple-700 underline ml-4" href="https://www.spaceappschallenge.org/2025/find-a-team/spacecrammers1/">Nasa Space Apps Challange link<a/>',
    video: true,
  },
  {
    mutualPhoto: true,
    title: "About Us",
    description:
      "We are a team of ambitious Ukrainian software engineers and product\n        analysts dedicated to our careers and studying at the KPI University. We\n        view studying as a main objective of our lives and so, dedicate a hefty\n        amount of time to this very purpose. We are also very keen on the topic\n        of space, which is why this contest drew our attention. Additionally, we\n        believe it's important to expand the boundaries of our knowledge, so we\n        decided to utilize our skills to make the lives of Space explorers\n        easier.",
    video: false,
  },
];

export default function Page() {
  return (
    <div className="px-5 max-w-4xl w-full mx-auto min-h-screen items-center justify-items-center min-h-screen">
      {atricles.map((article) => (
        <article key={article.title}>
          <h2 className="font-bold text-3xl max-md:text-2xl mt-10">
            {article.title}
          </h2>

          <p
            dangerouslySetInnerHTML={{
              __html: article.description.replace(/\n/g, "<br />"),
            }}
            className="mt-2 max-md:text-sm text-lg"
          ></p>

          {article.mutualPhoto && (
            <img
              className="w-56 m-auto my-4"
              src="/ivan_maria.jpg"
              alt="team"
            />
          )}

          {article.video && (
            <iframe
              className="w-full max-w-96 aspect-video m-auto py-6"
              src="https://www.youtube.com/embed/Wqb8iltkvVY?si=L0trQB_C_uB5YPz4"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          )}
        </article>
      ))}

      <div className="flex mt-10 flex-col gap-6">
        {members.map((member) => (
          <a href={member.linked} key={member.photo}>
            <Card className="bg-gray-800 hover:bg-gray-700">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                  <Image
                    src={member.photo}
                    alt={`Team Member ${member.name}`}
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <Button
                  variant="link"
                  className="text-xl text-white font-semibold"
                >
                  {member.name}
                </Button>
                <p className="text-sm text-gray-400">{member.role}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
