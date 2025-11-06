#FOR MacOS Users

run backend commands


cd backend
# Use Homebrew’s OpenJDK 17 installation
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home" && mvn clean spring-boot:run -DskipTests

run mysql commands

'''mysql -u root -p'''
# enter password when prompted

start - brew services start mysql
end/stop. - brew services stop mysql

.env.local file


