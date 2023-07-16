import Head from "next/head";
import {useState} from "react";

type Answer = {
    level: number;
    answer: number;
}

export default function Home() {
    const [baseCost, setBaseCost] = useState<number>(1000);
    const [answers, setAnswers] = useState<Answer[]>([]);

    /**
     * Handles the change of the textarea
     *
     * @param event The change event
     */
    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const rawString = event.target.value;
        const regex = /(\d+);(\d+);(\d+\.\d+)/g;

        const answers: Answer[] = [];

        while (true) {
            const match = regex.exec(rawString);
            if (!match) {
                break;
            }

            const [minLevel, maxLevel, multiplier] = match.slice(1);
            if (!minLevel || !maxLevel || !multiplier) {
                continue;
            }

            answers.push(...calculateRange(parseInt(minLevel), parseInt(maxLevel), parseFloat(multiplier)));
        }

        setAnswers(answers);
    }

    /**
     * Calculates the range of the formula
     *
     * @param minLevel the minimum level
     * @param maxLevel the maximum level
     * @param multiplier the multiplier
     */
    function calculateRange(minLevel: number, maxLevel: number, multiplier: number) {
        const answers: Answer[] = [];

        for (let level = minLevel; level <= maxLevel; level++) {
            // Math: baseCost * (multiplier ^ level)
            const answer = Math.round(baseCost * Math.pow(multiplier, level));

            answers.push({
                level,
                answer
            });
        }

        return answers;
    }

    return (
        <>
            <Head>
                <title>Formula Range Calculator</title>
                <meta name="description" content="Generated by create-t3-app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main
                className="flex min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div className="container grid grid-cols-12 gap-4 mx-auto">
                    <div className="col-span-6 flex flex-col items-center justify-center space-y-4">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <label htmlFor="baseCost" className="text-white text-2xl">
                                Base Cost
                            </label>
                            <input
                                id="baseCost"
                                type="number"
                                className="bg-gray-800 text-white p-2 rounded-md resize-none h-full"
                                defaultValue={baseCost}
                                onChange={(event) => setBaseCost(parseInt(event.target.value))}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <label htmlFor="formula" className="text-white text-2xl">
                                Formulas
                            </label>
                            <textarea
                                id="formula"
                                rows={10}
                                cols={50}
                                className="bg-gray-800 text-white p-2 rounded-md"
                                onBlur={handleChange}
                            />
                        </div>
                    </div>
                    <div className="col-span-6 flex flex-col items-center justify-center space-y-4">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <label htmlFor="answer" className="text-white text-2xl">
                                Answers
                            </label>
                            <textarea
                                id="answer"
                                rows={10}
                                cols={50}
                                className="bg-gray-800 text-white p-2 rounded-md resize-none h-full"
                                value={answers.map((answer) => `${answer.level} = ${answer.answer}`).join('\n')}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
