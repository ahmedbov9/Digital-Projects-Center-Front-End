import Navbar from './components/Navbar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment,
  faDiagramProject,
  faLaptopCode,
} from '@fortawesome/free-solid-svg-icons';
import './css/home.css';
import Footer from './components/Footer';
export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#e0e3e5' }}>
      <Navbar />

      <div
        className="hero-section text-center text-white py-5"
        style={{
          backgroundImage: 'linear-gradient(to right, #007bff, #0056b3)',
          color: '#fff',
        }}
      >
        <h1 className="display-4 mb-3">مرحباً بك في مركز المشاريع الرقمية</h1>
        <p className="lead">
          خدمات تطوير مواقع الويب والمشاريع الاحترافية بجودة عالية.
        </p>
      </div>

      <div className="container my-5">
        <div className="text-center mb-5">
          <h2 className="mb-4" style={{ color: '#0056b3' }}>
            خدماتنا
          </h2>
          <p className="text-muted">
            نقدم مجموعة متنوعة من الخدمات التقنية لتلبية احتياجاتك.
          </p>
        </div>

        <div className="row">
          <div className="col-md-4 mb-4">
            <div
              className="card shadow-sm border-0"
              style={{
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'scale(1.05)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'scale(1)')
              }
            >
              <div className="card-body text-center">
                <div
                  className="icon mb-3"
                  style={{ fontSize: '2.5rem', color: '#007bff' }}
                >
                  <FontAwesomeIcon icon={faLaptopCode} />
                </div>
                <h5 className="card-title">تطوير مواقع الويب</h5>
                <p className="card-text text-muted">
                  تصميم وتطوير مواقع ويب احترافية تلبي احتياجاتك.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div
              className="card shadow-sm border-0"
              style={{
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'scale(1.05)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'scale(1)')
              }
            >
              <div className="card-body text-center">
                <div
                  className="icon mb-3"
                  style={{ fontSize: '2.5rem', color: '#007bff' }}
                >
                  <FontAwesomeIcon icon={faDiagramProject}></FontAwesomeIcon>
                </div>
                <h5 className="card-title">مشاريع التخرج</h5>
                <p className="card-text text-muted">
                  تنفيذ مشاريع تخرج مبتكرة ومميزة بجودة عالية.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div
              className="card shadow-sm border-0"
              style={{
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'scale(1.05)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'scale(1)')
              }
            >
              <div className="card-body text-center">
                <div
                  className="icon mb-3"
                  style={{ fontSize: '2.5rem', color: '#007bff' }}
                >
                  <FontAwesomeIcon icon={faComment} />
                </div>
                <h5 className="card-title">استشارات تقنية</h5>
                <p className="card-text text-muted">
                  تقديم استشارات تقنية لمساعدتك في تحقيق أهدافك.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
