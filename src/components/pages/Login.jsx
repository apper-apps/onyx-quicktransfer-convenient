import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../App';

function Login() {
  const { isInitialized } = useContext(AuthContext);
  
useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 100;

    const initializeAuth = () => {
      try {
        // Ensure SDK is available and fully loaded
        if (!window.ApperSDK || !window.ApperSDK.ApperUI) {
          console.warn('ApperSDK not yet loaded, retrying...');
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(initializeAuth, retryDelay * retryCount);
          } else {
            console.error('ApperSDK failed to load after maximum retries');
          }
          return;
        }

        // Ensure DOM element exists and is properly mounted
        const authElement = document.querySelector("#authentication");
        if (!authElement) {
          console.warn('Authentication element not found, retrying...');
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(initializeAuth, retryDelay * retryCount);
          } else {
            console.error('Authentication element not found after maximum retries');
          }
          return;
        }

        // Verify element is actually in the DOM and not detached
        if (!document.body.contains(authElement)) {
          console.warn('Authentication element not attached to DOM, retrying...');
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(initializeAuth, retryDelay * retryCount);
          } else {
            console.error('Authentication element not properly attached after maximum retries');
          }
          return;
        }

        // Proceed with authentication initialization
        const { ApperUI } = window.ApperSDK;
        
        // Additional safety checks for ApperUI methods
        if (typeof ApperUI.showLogin !== 'function') {
          console.error('ApperUI.showLogin is not a function');
          return;
        }

        // Additional check to ensure ApperUI is fully initialized
        if (!ApperUI.setup || typeof ApperUI.setup !== 'function') {
          console.warn('ApperUI not fully initialized, retrying...');
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(initializeAuth, retryDelay * retryCount);
          } else {
            console.error('ApperUI failed to initialize properly after maximum retries');
          }
          return;
        }

        // Clear any existing content to prevent conflicts
        authElement.innerHTML = '';
        
        // Add a small delay to ensure DOM is ready for ApperUI operations
        setTimeout(() => {
          try {
            ApperUI.showLogin("#authentication");
          } catch (innerError) {
            console.error('Error during ApperUI.showLogin execution:', innerError);
            
            // If this is a DOM-related error, try to retry
            if (innerError.message && (innerError.message.includes('null') || innerError.message.includes('undefined'))) {
              console.warn('DOM-related error detected, retrying...');
              if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(initializeAuth, retryDelay * retryCount);
              }
            }
          }
        }, 10);

      } catch (error) {
        console.error('Error initializing authentication:', error);
        
        // Retry on error if we haven't exceeded max retries
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(initializeAuth, retryDelay * retryCount);
        }
      }
    };

    if (isInitialized) {
      // Increased delay to ensure DOM is fully ready and ApperSDK is stable
      setTimeout(initializeAuth, 100);
    }

    // Enhanced cleanup function
    return () => {
      try {
        const authElement = document.querySelector("#authentication");
        if (authElement && document.body.contains(authElement)) {
          authElement.innerHTML = '';
        }
      } catch (error) {
        console.warn('Error during authentication cleanup:', error);
      }
    };
  }, [isInitialized]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-emerald-700 to-emerald-600 text-white text-2xl 2xl:text-3xl font-bold">
            Q
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold">
              Sign in to QuickTransfer
            </div>
            <div className="text-center text-sm text-gray-500">
              Welcome back, please sign in to continue
            </div>
          </div>
        </div>
        <div id="authentication" />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-emerald-700 hover:text-emerald-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;