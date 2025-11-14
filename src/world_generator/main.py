import logging

from preprocess import preprocessOSM
from tiles import generateTiles

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(module)s - %(message)s",
    handlers=[
        logging.FileHandler("generator.log"),
        # logging.StreamHandler()
    ],
)

logger = logging.getLogger(__name__)


if __name__ == "__main__":
    logger.info("Starting the process...")
    preprocessOSM()
    generateTiles()
