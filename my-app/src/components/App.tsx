import React from 'react';


interface Props {}


interface State {}


class App extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {}
    }

    componentDidMount(): void {
        this.addCursorFollowerListener();
    }

    addCursorFollowerListener(): void {
        const root: HTMLElement = document.documentElement;

        document.addEventListener('mousemove', evt => {
            let x: number = evt.clientX / innerWidth;
            let y: number = evt.clientY / innerHeight;
        
            root.style.setProperty('--mouse-x', x.toString());
            root.style.setProperty('--mouse-y', y.toString());
        });
    }

    render() {
        return (
            <div id='app' className='container mx-auto h-screen flex'>
              App
            </div>
        )
    }
}

export default App;
