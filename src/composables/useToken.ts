
const getToken = async (): Promise<string | null> => {
  
  while (!window.Clerk?.loaded) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  try {
    const token = await window.Clerk.session?.getToken();
    return token || null;
  } catch (e) {
    console.error("Clerk session error:", e);
    return null;
  }
  
};

export default getToken;