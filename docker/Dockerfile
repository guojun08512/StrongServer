FROM node:8.11.3-stretch
# COPY nodeServer /src
ADD start.sh /start.sh
RUN chmod 755 /start.sh
ENV TZ=Asia/Shanghai 
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
CMD ["/start.sh"]
