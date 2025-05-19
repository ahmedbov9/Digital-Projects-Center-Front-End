import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faMailBulk } from '@fortawesome/free-solid-svg-icons';

export default function Footer(props) {
  return (
    <footer
      className="bg-primary text-center py-4"
      style={{ marginTop: props.margin || '0' }}
    >
      <div className="text-center text-white mt-3">
        <p>جميع الحقوق محفوظة &copy; 2025 مركز المشاريع الرقمية</p>
      </div>
      <a
        href="https://github.com/ahmedbov9"
        target="_blank"
        rel="noopener noreferrer"
        style={{ margin: '0 10px' }}
      >
        <FontAwesomeIcon color="white" icon={faGithub} fontSize={'19'} />
      </a>
      <a
        href="https://wa.me/+966565125040"
        target="_blank"
        rel="noopener noreferrer"
        style={{ margin: '0 10px' }}
      >
        <FontAwesomeIcon color="white" icon={faWhatsapp} fontSize={'19'} />
      </a>
      <a href="mailto:companybov9@gmail.com" style={{ margin: '0 10px' }}>
        <FontAwesomeIcon color="white" icon={faMailBulk} fontSize={'19'} />
      </a>
    </footer>
  );
}
