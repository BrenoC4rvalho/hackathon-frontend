import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { paths } from './paths';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';
import { Layout } from '@/components/Layout';

import Login        from '@/pages/Login';
import Register     from '@/pages/Register';
import Home         from '@/pages/Home';
import Alunos       from '@/pages/Alunos';
import Grupos       from '@/pages/Grupos';
import Vinculos     from '@/pages/Vinculos';
import Tarefas      from '@/pages/Tarefas';
import Notificacoes from '@/pages/Notificacoes';
import Whatsapp     from '@/pages/Whatsapp';
import NotFound     from '@/pages/NotFound';

function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
      <Layout>{children}</Layout>
    </PrivateRoute>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.login}    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path={paths.register} element={<PublicRoute><Register /></PublicRoute>} />

        <Route path={paths.home}         element={<PrivateLayout><Home /></PrivateLayout>} />
        <Route path={paths.alunos}       element={<PrivateLayout><Alunos /></PrivateLayout>} />
        <Route path={paths.grupos}       element={<PrivateLayout><Grupos /></PrivateLayout>} />
        <Route path={paths.vinculos}     element={<PrivateLayout><Vinculos /></PrivateLayout>} />
        <Route path={paths.tarefas}      element={<PrivateLayout><Tarefas /></PrivateLayout>} />
        <Route path={paths.notificacoes} element={<PrivateLayout><Notificacoes /></PrivateLayout>} />
        <Route path={paths.whatsapp}     element={<PrivateLayout><Whatsapp /></PrivateLayout>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
