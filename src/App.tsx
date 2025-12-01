import { Layout } from './components/Layout';
import { SetupScreen } from './components/Setup/SetupScreen';
import { WheelScreen } from './components/Wheel/WheelScreen';
import { BracketScreen } from './components/Tournament/BracketScreen';
import { ResultsScreen } from './components/Tournament/ResultsScreen';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {

    return (
        <Layout>
            <Routes>
                <Route path="/home" element={<SetupScreen />} />
                <Route path="/draft" element={<WheelScreen />} />
                <Route path="/tournament" element={<BracketScreen />} />
                <Route path="/results" element={<ResultsScreen />} />
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </Layout>
    );
}

export default App;
