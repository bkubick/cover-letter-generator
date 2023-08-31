import React, { FormEvent, ReactElement } from 'react';
import axios from 'axios';


interface Props {}


interface State {
    chatGPTModel: string;
    company: string;
    position: string;
    jobDescription: string;
    experiences: string;
    prevCoverLetter1: string;
    prevCoverLetter2: string;
    prevCoverLetter3: string;

    apiKey: string;
    generatedCoverLetter: string;
    currentTab: string;
}


class CoverLetterGenerator extends React.Component<Props, State> {

    chatGPTEndpoint: string = 'https://api.openai.com/v1/chat/completions';
    temperature: number = 0;

    constructor(props: Props) {
        super(props);

        this.state = {
            chatGPTModel: 'gpt-3.5-turbo',
            company: '',
            position: '',
            jobDescription: '',
            experiences: '',
            prevCoverLetter1: '',
            prevCoverLetter2: '',
            prevCoverLetter3: '',

            apiKey: '',

            generatedCoverLetter: '',
            currentTab: 'cover-letter',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Generates a prompt for the GPT-3 chatbot.
     * 
     * @returns The generated prompt.
     */
    get coverLetterPrompt() {
        let prompt: string = `
            Please write a cover letter between 350 and 450 words for the following job posting for the position of ${this.state.position || '\"\"'} at ${this.state.company || '\"\"'}:

            Job Description:
            "${this.state.jobDescription}"
            
            There is no need to include a header or footer. The cover letter should be written in a professional manner and should be tailored to the job posting using the following experiences:

            My Experiences:
            "${this.state.experiences}"\n
        `;

        const coverLetterExamples: string[] = [
            this.state.prevCoverLetter1,
            this.state.prevCoverLetter2,
            this.state.prevCoverLetter3,
        ];

        if (coverLetterExamples[0] || coverLetterExamples[1] || coverLetterExamples[2]) {
            prompt += 'Please use my following cover letters that I have used in the past as a reference:\n\n';
        }

        coverLetterExamples.forEach((coverLetter, index) => {
            if (coverLetter) {
                prompt += `Cover Letter Example ${index + 1}:\n`;
                prompt += `"${coverLetter}"`;
                prompt += '\n\n';
            }
        });

        return prompt;
    }

    /**
     * Generates a request for the GPT chatbot.
     * 
     * @param coverLetterPrompt The prompt to send to the GPT chatbot.
     * @returns The generated request.
     */
    generateGptRequest(coverLetterPrompt: string) {
        const request: object = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.apiKey}`,
            },
            data: {
                model: this.state.chatGPTModel,
                messages: [
                    {
                      role: "user",
                      content: coverLetterPrompt
                    },
                ],
                temperature: this.temperature,
            },
        };

        return request;
    }

    /**
     * Handles the submit event for the cover letter generator form.
     * Sends a request to the GPT chatbot to generate a cover letter.
     * 
     * @param event The submit event.
     */
    async handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const self = this;
        const request: any = this.generateGptRequest(this.coverLetterPrompt);

        try {
            const response = await axios.post(
                self.chatGPTEndpoint, request.data, { headers: request.headers }
            );

            const generatedCoverLetter = response.data.choices[0].message.content;
            self.setState({ generatedCoverLetter: generatedCoverLetter });
        } catch (error) {
            console.error('Error generating cover letter: ', error);
            const errorMessage: string = 'Oops... There was an issue generating your cover letter. Check your API key and try again!';
            self.setState({ generatedCoverLetter: errorMessage });
        }
    };

    /**
     * Generates the cover letter text display.
     * Default text is 'No cover letter generated.... yet!'
     * 
     * @returns The cover letter text display.
     */
    get generateCoverLetterTextDisplay(): ReactElement[] {
        const text: string = this.state.generatedCoverLetter || 'No cover letter generated.... yet!';

        return text.split(/\n/).map((line, index) => {
            return <React.Fragment key={index}>{line}<br/></React.Fragment>
        });
    }

    /**
     * Returns the class for the tab.
     * 
     * @param tab The tab to get the class for.
     * @returns The class for the tab.
     */
    tabClass(tab: string): string {
        if (tab == this.state.currentTab) {
            return 'inline-block p-4 text-primary border-b-2 border-primary rounded-t-lg active dark:text-primary dark:border-primary';
        }
        return 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300';
    }

    render() {
        return (
          <div className="text-white w-full px-10">
            <div className='grid lg:grid-cols-12'>
                <div className='col-span-5 lg:overflow-hidden flex'>
                    <div className='overflow-y-scroll no-scrollbar px-5'>
                        <div className='lg:h-screen'>
                            <h1 className='sticky top-0 backdrop-blur z-10 uppercase text-2xl font-medium py-5'>
                                Cover Letter Generator
                            </h1>
                            <form className='text-start pb-10 text-slate-400' onSubmit={ this.handleSubmit }>
                                <div className='py-10'>
                                    <div className='section mb-8'>
                                        <div className='mb-4 text-lg font-medium text-slate-300'>
                                            Chat GPT Model:
                                        </div>
                                        <div className='flex'>
                                            <div className='mr-3'>
                                                <input
                                                    className='mr-2'
                                                    type="radio"
                                                    name="topping"
                                                    value="gpt-3.5-turbo"
                                                    id="gpt-35-turbo"
                                                    checked={this.state.chatGPTModel === "gpt-3.5-turbo"}
                                                    onChange={(e) => this.setState({ chatGPTModel: e.target.value })}/>
                                                <label htmlFor="gpt-35-turbo">gpt-3.5-turbo</label>
                                            </div>
                                            <div className='mr-3'>
                                                <input
                                                    className='mr-2'
                                                    type="radio"
                                                    name="topping"
                                                    value="gpt-3.5-turbo-16k"
                                                    id="gpt-35-turbo-16k"
                                                    checked={this.state.chatGPTModel === "gpt-3.5-turbo-16k"}
                                                    onChange={(e) => this.setState({ chatGPTModel: e.target.value })}/>
                                                <label htmlFor="gpt-35-turbo-16k">gpt-3.5-turbo-16k</label>
                                            </div>
                                            <div className='mr-3'>
                                                <input
                                                    className='mr-2'
                                                    type="radio"
                                                    name="topping"
                                                    value="gpt-4"
                                                    id="gpt-4"
                                                    checked={this.state.chatGPTModel === "gpt-4"}
                                                    onChange={(e) => this.setState({ chatGPTModel: e.target.value })}/>
                                                <label htmlFor="gpt-4">gpt-4</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='section mb-8'>
                                        <div className='mb-4 text-lg font-medium text-slate-300'>
                                            Position Details
                                            <div className='text-sm font-light'>
                                                List the position and company name you are applying for. Also, include the job description
                                                for the position. You can rephrase or only include the important parts of the job description
                                                you know you have experience with.
                                            </div>
                                        </div>
                                        <input 
                                            className='input w-full mr-4 mb-4'
                                            placeholder='Job Position'
                                            value={this.state.position}
                                            onChange={(e) => this.setState({ position: e.target.value })}/>
                                        <input 
                                            className='input w-full mr-4 mb-4'
                                            placeholder='Company Name'
                                            value={this.state.company}
                                            onChange={(e) => this.setState({ company: e.target.value })}/>
                                        <textarea
                                            className='textarea-input w-full'
                                            placeholder='Job Description'
                                            value={this.state.jobDescription}
                                            onChange={(e) => this.setState({ jobDescription: e.target.value })}/>
                                    </div>
                                    <div className='section mb-8'>
                                        <div className='mb-4 text-lg font-medium text-slate-300'>
                                            Your Experiences
                                            <div className='text-sm font-light'>
                                                Write out all of your work experiences you have. Try to be descriptive and keep it
                                                specific to the job posting. This will help the chatbot generate a more accurate cover letter.
                                            </div>
                                        </div>
                                        <textarea
                                            className='textarea-input w-full'
                                            placeholder='Work experiences, projects, etc.'
                                            value={this.state.experiences}
                                            onChange={(e) => this.setState({ experiences: e.target.value })}/>
                                    </div>
                                    <div className='section mb-8'>
                                        <div className='mb-4 text-lg font-medium text-slate-300'>
                                            Cover Letter Examples
                                            <div className='text-sm font-light'>
                                                Please give some example cover letters you have used in the past. This will be
                                                used as a reference for the chatbot to generate a more accurate cover letter.
                                            </div>
                                        </div>
                                        <textarea
                                            className='textarea-input w-full mb-4'
                                            placeholder='Cover Letter Example 1'
                                            value={this.state.prevCoverLetter1}
                                            onChange={(e) => this.setState({ prevCoverLetter1: e.target.value })}/>
                                        <textarea
                                            className='textarea-input w-full mb-4'
                                            placeholder='Cover Letter Example 2'
                                            value={this.state.prevCoverLetter2}
                                            onChange={(e) => this.setState({ prevCoverLetter2: e.target.value })}/>
                                        <textarea
                                            className='textarea-input w-full'
                                            placeholder='Cover Letter Example 3'
                                            value={this.state.prevCoverLetter3}
                                            onChange={(e) => this.setState({ prevCoverLetter3: e.target.value })}/>
                                    </div>
                                </div>
                                <div className='flex justify-start'>
                                    <input 
                                        className='input w-full mr-4'
                                        placeholder='API Key'
                                        value={this.state.apiKey}
                                        type='password'
                                        onChange={(e) => this.setState({ apiKey: e.target.value })}/>
                                    <button className='btn btn-primary-outline' type="submit">
                                        Generate
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className='col-span-7 lg:overflow-hidden'>
                    <div className='overflow-y-scroll no-scrollbar px-5'>
                        <div className='lg:h-screen'>
                            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                                <ul className="flex flex-wrap -mb-px">
                                    <li className="mr-2">
                                        <a 
                                            href="#prompt"
                                            className={ this.tabClass('prompt') }
                                            onClick={() => this.setState({ currentTab: 'prompt' })}>
                                            Prompt
                                        </a>
                                    </li>
                                    <li className="mr-2">
                                        <a
                                            href="#cover-letter"
                                            className={ this.tabClass('cover-letter') }
                                            aria-current="page"
                                            onClick={() => this.setState({ currentTab: 'cover-letter' })}>
                                            Cover Letter
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            
                            <div id="cover-letter" className={`py-3 h-auto ${'cover-letter' === this.state.currentTab ? "visible" : "hidden"}`}>
                                { this.generateCoverLetterTextDisplay }
                            </div>
                            <div id="prompt" className={`py-3 h-auto ${'prompt' === this.state.currentTab ? "visible" : "hidden"}`}>
                                { this.coverLetterPrompt.split(/\n/).map((line, index) => <React.Fragment key={index}>{line}<br/></React.Fragment>) }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        );
      }
};

export default CoverLetterGenerator;
