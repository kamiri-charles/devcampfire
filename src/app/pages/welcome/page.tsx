import { useState } from 'react';
import GetStarted from '@/components/get-started'

function Welcome() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData: any) => {
		setUser(userData);
	};

  return (
    <GetStarted onLogin={handleLogin} />
  )
}

export default Welcome