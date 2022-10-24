
all:
	@docker-compose up --build
	@echo "\n\033[0;33m[ft_transcendence run]\033[0m"

check:
	@echo "\n\033[0;33m[compose containers all]\033[0m"
	@docker-compose ps
	@echo "\n\033[0;33m[docker containers all]\033[0m"
	@docker ps -a
	@echo "\n\033[0;33m[images all]\033[0m"
	@docker images -a
	@docker volume ls

log:
	@echo "\n\033[0;33m[containers log]\033[0m"
	@docker-compose logs

clean:
	@docker-compose down --rmi all
	@docker volume rm psql

fclean:
	@echo "\n\033[0;33m[delete container && imgaes all(compose)]\033[0m"
	@docker-compose down
	@docker system prune -a --force
	@docker volume rm psql
