export default function
parseFrenchDate(str: string): number
{
  const months: Record<string, number> = {
    janvier: 0,
    février: 1,
    mars: 2,
    avril: 3,
    mai: 4,
    juin: 5,
    juillet: 6,
    août: 7,
    septembre: 8,
    octobre: 9,
    novembre: 10,
    décembre: 11,
  };

  const parts = str.split(" ");
  const day = Number(parts[0]);
  const month = months[parts[1].toLowerCase()];
  const year = Number(parts[2]);

  return new Date(year, month, day).getTime();
}
